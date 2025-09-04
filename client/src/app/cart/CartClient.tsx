'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch } from "@/redux/store";
import { openModal, closeModal } from "@/redux/reducers";
import CheckoutModal, { ProductLite } from "@/components/modals/CheckoutModal";
import { addItem, clearCart, removeItem, setItemQty } from './actions';
import { OrderCookie } from '@/interfaces';
import { useCloseLoader } from '@/hooks';
import {
  PageWrap,
  Container,
  TitleRow,
  LeftCol,
  RightCol,
  Card,
  ItemRow,
  ItemInfo,
  Thumb,
  ThumbImgWrap,
  ItemTitle,
  ItemMeta,
  QtyWrap,
  QtyBtn,
  QtyInput,
  PriceCol,
  RemoveBtn,
  Divider,
  SummaryCard,
  SummaryRow,
  SummaryTitle,
  SummaryValue,
  SummaryActions,
  GhostBtn,
  PrimaryBtn,
  EmptyWrap,
  EmptyTitle,
  EmptyText,
  Skeleton
} from './styles';

type Props = { initialOrder: OrderCookie | null };

// ---- Тип ответа твоего API /api/products/[productArticle] ----
type ProductApi = {
  id: number;
  article: string;
  name: string;
  title?: string | null;
  cover: string;
  photos: string[];
  priceOfPack?: number | null;
  // ...остальные поля нам не нужны
};

// Нормализуем относительный путь до публичного src (добавляем ведущий слеш)
function toPublicSrc(p?: string | null): string | undefined {
  if (!p) return undefined;
  if (/^https?:\/\//i.test(p)) return p;
  const rel = p.startsWith('/') ? p : `/${p}`;
  return rel;
}

function formatNumber(n: number) {
  return Intl.NumberFormat('ru-RU').format(n);
}

function formatPrice(n: number) {
  return Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);
}

export default function CartClient({ initialOrder }: Props) {
  useCloseLoader();
  const [order, setOrder] = useState<OrderCookie | null>(initialOrder);
  const [isPending, start] = useTransition();

  const dispatch = useAppDispatch();

  const openCheckout = () => {
    if (!order || items.length === 0) return;

    // пробрасываем текущий order и productMap в контент модалки
    dispatch(
      openModal({
        content: (
          <CheckoutModal
            order={order}
            productMap={productMap as Record<string, ProductLite>}
            onClose={() => dispatch(closeModal())}
          />
        ),
        // при желании можно добавить disableOverlayClose: true
      })
    );
  };

  // карта метаданных товаров по артикулу
  const [productMap, setProductMap] = useState<Record<string, ProductLite>>({});
  const [loadingArticles, setLoadingArticles] = useState<Set<string>>(new Set());

  const items = order?.items ?? [];
  const totalCount = useMemo(
    () => items.reduce((acc, it) => acc + it.count, 0),
    [items]
  );
  const isEmpty = !order || items.length === 0;

  // Считаем общий тотал по корзине (сумма подытогов)
  const grandTotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const price = productMap[it.productArticle]?.priceOfPack ?? 0;
      return sum + price * it.count;
    }, 0);
  }, [items, productMap]);

  // --- Клиентская подгрузка карточек товаров по артикулу ---
  useEffect(() => {
    if (!items.length) return;
    const need = items
      .map((i) => i.productArticle)
      .filter((a) => !productMap[a] && !loadingArticles.has(a));

    if (need.length === 0) return;

    const nextLoading = new Set(loadingArticles);
    need.forEach((a) => nextLoading.add(a));
    setLoadingArticles(nextLoading);

    (async () => {
      try {
        // параллельно тянем все недостающие продукты
        const results = await Promise.allSettled(
          need.map(async (a) => {
            const res = await fetch(`/api/products/${encodeURIComponent(a)}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`API: ${res.status}`);
            const p: ProductApi = await res.json();
            const simplified: ProductLite = {
              article: p.article,
              name: p.name || p.title || p.article,
              cover: toPublicSrc(p.cover),
              priceOfPack: Number(p.priceOfPack ?? 0) || 0,
            };
            return simplified;
          })
        );

        setProductMap((prev) => {
          const next = { ...prev };
          results.forEach((r) => {
            if (r.status === 'fulfilled') {
              const prod = r.value;
              next[prod.article] = prod;
            }
          });
          return next;
        });
      } finally {
        setLoadingArticles((prev) => {
          const s = new Set(prev);
          need.forEach((a) => s.delete(a));
          return s;
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.productArticle).join('|')]); // обновляем, если набор артикулов изменился

  // --- Действия корзины ---
  const inc = (article: string) =>
    start(async () => setOrder(await addItem(article, 1)));

  const dec = (article: string, current: number) =>
    start(async () => {
      const next = Math.max(1, current - 1);
      setOrder(await setItemQty(article, next));
    });

  const setQty = (article: string, value: string) =>
    start(async () => {
      const val = Math.max(1, Math.min(999, Number(value) || 1));
      setOrder(await setItemQty(article, val));
    });

  const remove = (article: string) =>
    start(async () => setOrder(await removeItem(article)));

  const clear = () =>
    start(async () => setOrder(await clearCart()));

  return (
    <PageWrap>
      <Container>
        <TitleRow>
          <h1>Корзина</h1>
          {!isEmpty && <span>{formatNumber(totalCount)} товар(ов)</span>}
        </TitleRow>

        {isEmpty ? (
          <EmptyWrap>
            <EmptyTitle>Корзина пуста</EmptyTitle>
            <EmptyText>Загляните в каталог и добавьте товары.</EmptyText>
            <PrimaryBtn as={Link} href="/catalog">В каталог</PrimaryBtn>
          </EmptyWrap>
        ) : (
          <>
            <LeftCol>
              <Card>
                {items.map((it, idx) => {
                  const meta = productMap[it.productArticle];
                  const isLoading = loadingArticles.has(it.productArticle) || !meta;
                  const unitPrice = meta?.priceOfPack ?? 0;
                  const lineTotal = unitPrice * it.count;

                  return (
                    <div key={it.id}>
                      <ItemRow>
                        <ItemInfo>
                          <Thumb aria-hidden>
                            {isLoading ? (
                              <Skeleton />
                            ) : meta?.cover ? (
                              <ThumbImgWrap>
                                <Image
                                  src={meta.cover}
                                  alt={meta.name || `Товар ${it.productArticle}`}
                                  fill
                                  sizes="72px"
                                  style={{ objectFit: 'cover' }}
                                  priority={idx < 3}
                                />
                              </ThumbImgWrap>
                            ) : (
                              <Skeleton />
                            )}
                          </Thumb>

                          <div>
                            <ItemTitle>
                              {meta?.name ? (
                                meta.name
                              ) : (
                                <Skeleton style={{ width: 220, height: 16 }} />
                              )}
                            </ItemTitle>
                            <ItemMeta>Артикул: {it.productArticle}</ItemMeta>
                            {/* Цена за упаковку под названием (когда доступна) */}
                            <ItemMeta>
                              {isLoading ? <Skeleton style={{ width: 120, height: 14 }} /> : `Цена: ${formatPrice(unitPrice)} / уп.`}
                            </ItemMeta>
                          </div>
                        </ItemInfo>

                        <QtyWrap>
                          <QtyBtn
                            disabled={isPending || it.count <= 1}
                            onClick={() => dec(it.productArticle, it.count)}
                            aria-label="Уменьшить количество"
                          >
                            –
                          </QtyBtn>
                          <QtyInput
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={it.count}
                            onChange={(e) => setQty(it.productArticle, e.target.value)}
                          />
                          <QtyBtn
                            disabled={isPending || it.count >= 999}
                            onClick={() => inc(it.productArticle)}
                            aria-label="Увеличить количество"
                          >
                            +
                          </QtyBtn>
                        </QtyWrap>

                        <PriceCol>
                          {/* Подытог по строке: кол-во * цена за уп. */}
                          <div>{isLoading ? '—' : formatPrice(lineTotal)}</div>
                          <RemoveBtn
                            disabled={isPending}
                            onClick={() => remove(it.productArticle)}
                          >
                            Удалить
                          </RemoveBtn>
                        </PriceCol>
                      </ItemRow>

                      {idx < items.length - 1 && <Divider />}
                    </div>
                  );
                })}
              </Card>

              <GhostBtn disabled={isPending} onClick={clear}>
                Очистить корзину
              </GhostBtn>
            </LeftCol>

            <RightCol>
              <SummaryCard>
                <SummaryTitle>Итого</SummaryTitle>
                <SummaryRow>
                  <span>Товары</span>
                  <SummaryValue>{formatNumber(totalCount)}</SummaryValue>
                </SummaryRow>

                <SummaryRow>
                  <span>Сумма</span>
                  <SummaryValue>{formatPrice(grandTotal)}</SummaryValue>
                </SummaryRow>

                <Divider />

                <SummaryRow $strong>
                  <span>К оплате</span>
                  <SummaryValue>{formatPrice(grandTotal)}</SummaryValue>
                </SummaryRow>

                <SummaryActions>
                 <PrimaryBtn as="button" onClick={openCheckout} aria-disabled={isPending}>
                    Перейти к оформлению
                  </PrimaryBtn>
                  <GhostBtn as={Link} href="/catalog">
                    Продолжить покупки
                  </GhostBtn>
                </SummaryActions>
              </SummaryCard>
            </RightCol>
          </>
        )}
      </Container>
    </PageWrap>
  );
}

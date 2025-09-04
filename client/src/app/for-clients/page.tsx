'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from '@/constants';

const PageWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 28px 0 40px;
`;

const PageInner = styled.div`
  width: 1200px;
  min-width: 1100px;

  @media (${WINDOW_WIDTH.MOBILE}) {
    width: 92%;
    min-width: auto;
  }
`;

/* ---------- Табы ---------- */

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;

  @media (${WINDOW_WIDTH.MOBILE}) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const TabButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  border-radius: 12px;
  padding: 0 18px;
  border: 1px solid ${({ $active }) => ($active ? 'transparent' : '#eef0f4')};
  background: ${({ $active }) => ($active ? COLORS.CORPORATE_BLUE : '#f6f8fb')};
  color: ${({ $active }) => ($active ? '#fff' : '#111827')};
  ${WIX_MADEFOR_TEXT_WEIGHT('600')};
  font-size: 18px;
  letter-spacing: -0.3px;
  cursor: pointer;
  transition: filter .2s ease;

  &:hover { filter: brightness(0.98); }

  @media (${WINDOW_WIDTH.MOBILE}) {
    height: 52px;
    font-size: 16px;
  }
`;

/* ---------- Контент ---------- */

const Title = styled.h1`
  margin: 26px 0 18px;
  color: ${COLORS.CORPORATE_BLUE};
  ${WIX_MADEFOR_TEXT_WEIGHT('700')};
  font-size: 34px;
  letter-spacing: -0.8px;

  @media (${WINDOW_WIDTH.MOBILE}) {
    font-size: 28px;
    margin: 18px 0 12px;
  }
`;

const H2 = styled.h2`
  margin: 22px 0 10px;
  color: ${COLORS.CORPORATE_BLUE};
  ${WIX_MADEFOR_TEXT_WEIGHT('500')};
  font-size: 20px;
  letter-spacing: -0.3px;
`;

const P = styled.p`
  margin: 8px 0;
  color: #1f2937;
  font-size: 18px;
  line-height: 1.6;

  @media (${WINDOW_WIDTH.MOBILE}) {
    font-size: 16px;
  }
`;

const UL = styled.ul`
  margin: 6px 0 12px 18px;
  padding: 0;
`;

const LI = styled.li`
  margin: 6px 0;
  color: #1f2937;
  font-size: 18px;
  line-height: 1.6;

  @media (${WINDOW_WIDTH.MOBILE}) {
    font-size: 16px;
  }
`;

type TabKey = 'order' | 'delivery' | 'refund';

export default function ForClientsPage() {
  const [tab, setTab] = useState<TabKey>('order');

  return (
    <PageWrap>
      <PageInner>
        <Tabs>
          <TabButton $active={tab === 'order'} onClick={() => setTab('order')}>
            Как оформить заказ
          </TabButton>
          <TabButton $active={tab === 'delivery'} onClick={() => setTab('delivery')}>
            Доставка и подъём
          </TabButton>
          <TabButton $active={tab === 'refund'} onClick={() => setTab('refund')}>
            Возврат
          </TabButton>
        </Tabs>

        {tab === 'order' && (
          <>
            <Title>КАК ОФОРМИТЬ ЗАКАЗ</Title>

            <H2>1. Варианты оформления</H2>
            <UL>
              <LI><b>На сайте</b> — добавьте товар в корзину и заполните короткую форму заказа.</LI>
              <LI><b>По телефону</b> — позвоните нам, поможем подобрать и оформим заказ за вас.</LI>
              <LI><b>Мессенджеры</b> — напишите в WhatsApp или Telegram, пришлите фото/артикул.</LI>
              <LI><b>В салоне</b> — приезжайте в наш магазин, покажем образцы и всё оформим на месте.</LI>
            </UL>

            <H2>2. Подтверждение заказа</H2>
            <P>
              После оформления менеджер свяжется с вами, чтобы подтвердить наличие, согласовать дату и время доставки,
              а также уточнить условия подъёма и оплаты.
            </P>
            <UL>
              <LI>Проверим остатки на складе и сроки поставки (если требуется).</LI>
              <LI>Рассчитаем стоимость доставки с учётом адреса и подъёма на этаж.</LI>
              <LI>Подберём удобное время: будни 9:00–19:00, выходные 10:00–18:00.</LI>
            </UL>

            <H2>3. Оплата</H2>
            <UL>
              <LI>Картой/наличными при получении, либо онлайн по ссылке на оплату.</LI>
              <LI>Безналичный расчёт — по счёту (для физ. и юр. лиц).</LI>
              <LI>Часть товаров можно оплатить по split (если доступно на момент покупки).</LI>
            </UL>

            <H2>4. Самовывоз</H2>
            <P>
              Возможен самовывоз со склада/салона — подтвердите у менеджера адрес и время, чтобы мы подготовили заказ.
            </P>
          </>
        )}

        {tab === 'delivery' && (
          <>
            <Title>ДОСТАВКА И ПОДЪЁМ</Title>

            <H2>1. Зоны и сроки</H2>
            <P>
              Доставляем по городу и области. Срок — обычно 1–2 дня по городу; по области — индивидуально.
              При больших объёмах или редких позициях сроки согласовываются дополнительно.
            </P>

            <H2>2. Стоимость</H2>
            <UL>
              <LI>По городу — фиксированная ставка либо расчёт от дистанции (уточнит менеджер).</LI>
              <LI>За пределы города — по километражу/весу/объёму.</LI>
              <LI>Повторная подача машины при отмене по вине клиента — оплачивается отдельно.</LI>
            </UL>

            <H2>3. Подъём на этаж</H2>
            <UL>
              <LI>Лифт — обычно дешевле (за место/пачку).</LI>
              <LI>Без лифта — доплата за этаж и объём (расчёт индивидуально).</LI>
              <LI>Тяжёлые позиции (например, клей/подложка) — учитываются отдельно.</LI>
            </UL>

            <H2>4. Время и доступ</H2>
            <UL>
              <LI>Курьер привезёт в согласованный интервал. Если требуется пропуск — пожалуйста, оформите заранее.</LI>
              <LI>Автодоступ во двор/к подъезду ускоряет выгрузку и уменьшает стоимость подъёма.</LI>
            </UL>

            <H2>5. Проверка товара</H2>
            <UL>
              <LI>При получении проверьте целостность упаковки и соответствие артикулов/количества.</LI>
              <LI>Несоответствия фиксируйте с курьером сразу (фото/акт), тут же решим вопрос.</LI>
            </UL>
          </>
        )}

        {tab === 'refund' && (
          <>
            <Title>ВОЗВРАТ</Title>

            <H2>1. В каких случаях возможен возврат</H2>
            <UL>
              <LI>Новый товар в неповреждённой заводской упаковке, без следов эксплуатации.</LI>
              <LI>Сохранены документы и чек; по спец-заказам условия согласуются отдельно.</LI>
            </UL>

            <H2>2. Сроки</H2>
            <P>
              Возврат надлежащего качества принимаем в рамках срока, установленного законом о защите прав потребителей.
              Бракованный товар меняем/возвращаем деньги по результатам экспертизы или фотофиксации дефекта.
            </P>

            <H2>3. Процедура</H2>
            <UL>
              <LI>Свяжитесь с нами: укажите номер заказа, артикул и причину возврата.</LI>
              <LI>Согласуем способ: привезти в салон или оформить обратную доставку (оплачивается отдельно).</LI>
              <LI>После приёмки и проверки оформим обмен либо возврат средств тем же способом оплаты.</LI>
            </UL>

            <H2>4. Что не подлежит возврату</H2>
            <UL>
              <LI>Товар с явными следами монтажа/эксплуатации.</LI>
              <LI>Повреждённый по вине покупателя или без упаковки.</LI>
              <LI>Индивидуальные/спец-позиции, изготовленные под заказ (если не оговорено иное).</LI>
            </UL>

            <H2>5. Гарантия</H2>
            <P>
              На продукцию действует гарантия производителя при соблюдении регламента хранения и монтажа.
              Рекомендуем хранить упаковки горизонтально, избегать влаги, перепадов температуры и ударных нагрузок.
            </P>
          </>
        )}
      </PageInner>
    </PageWrap>
  );
}

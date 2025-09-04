// Добавить 1 шт. товара с productId=42
// updateOrder({ type: 'add', productId: 42 });

// Добавить 3 шт. товара с productId=7
// updateOrder({ type: 'add', productId: 7, count: 3 });

// Установить точное количество (напр., 10 шт.) для productId=42
// updateOrder({ type: 'setCount', productId: 42, count: 10 });

// Удалить товар с productId=7
// updateOrder({ type: 'remove', productId: 7 });

// Очистить корзину (items -> [])
// updateOrder({ type: 'clear' });

// client/src/utils/orders-cookie.ts
import { OrderCookie } from "@/interfaces";

const COOKIE_NAME = 'orders';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 дней

const ORDER_ID_KEY = 'orders_id_seq';
const ITEM_ID_KEY = 'orders_item_id_seq';

// --- Хелпер: на сервере получить ReadonlyRequestCookies с явным await ---
async function getServerCookies() {
  const { cookies } = await import('next/headers');
  return cookies();
}

// --- Низкоуровневое чтение/запись/удаление куки ---

async function readRawCookie(name: string): Promise<string | null> {
  if (typeof window === 'undefined') {
    const store = await getServerCookies();
    return store.get(name)?.value ?? null;
  }

  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

async function writeRawCookie(name: string, rawValue: string, maxAgeSeconds = COOKIE_MAX_AGE_SECONDS) {
  if (typeof window === 'undefined') {
    const store = await getServerCookies();
    store.set({
      name,
      value: rawValue, // уже encodeURIComponent(...)
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: maxAgeSeconds,
      secure: true,
    });
    return;
  }

  const parts = [
    `${name}=${rawValue}`,
    `Max-Age=${maxAgeSeconds}`,
    'Path=/',
    'SameSite=Lax',
  ];
  document.cookie = parts.join('; ');
}

async function deleteRawCookie(name: string) {
  if (typeof window === 'undefined') {
    const store = await getServerCookies();
    // у API есть .delete(name)
    try { store.delete(name); } catch {
      // fallback: set Max-Age=0
      store.set({ name, value: '', path: '/', maxAge: 0 });
    }
    return;
  }
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function safeParse<T>(rawEncoded: string | null): T | null {
  if (!rawEncoded) return null;
  try {
    const json = decodeURIComponent(rawEncoded);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function nowISO(): string {
  return new Date().toISOString();
}

async function nextSeq(key: string): Promise<number> {
  const raw = await readRawCookie(key);
  const current = raw ? Number(decodeURIComponent(raw)) : 0;
  const next = Number.isFinite(current) ? current + 1 : 1;
  await writeRawCookie(key, encodeURIComponent(String(next)), COOKIE_MAX_AGE_SECONDS);
  return next;
}

async function nextOrderId(): Promise<number> {
  return nextSeq(ORDER_ID_KEY);
}

async function nextItemId(): Promise<number> {
  return nextSeq(ITEM_ID_KEY);
}

// --- Публичные API ---

/** Вернуть текущий заказ из куки "orders" (или null) */
export async function getOrder(): Promise<OrderCookie | null> {
  const order = safeParse<OrderCookie>(await readRawCookie(COOKIE_NAME));
  return order ?? null;
}

type UpdateAction =
  | { type: 'add'; productArticle: string; count?: number }
  | { type: 'remove'; productArticle: string }
  | { type: 'setCount'; productArticle: string; count: number }
  | { type: 'clear' };

/**
 * Создаёт заказ при отсутствии куки или обновляет items существующего заказа.
 * Возвращает актуальное состояние заказа.
 */
export async function updateOrder(action: UpdateAction): Promise<OrderCookie> {
  const existing = await getOrder();

  const order: OrderCookie =
    existing ?? {
      id: await nextOrderId(),
      status: 'processing',
      createdAt: nowISO(),
      updatedAt: nowISO(),
      items: []
    };

  let items = [...order.items];

  switch (action.type) {
    case 'clear': {
      items = [];
      break;
    }
    case 'add': {
      const delta = Math.max(1, Math.floor(action.count ?? 1));
      const idx = items.findIndex(i => i.productArticle === action.productArticle);
      if (idx >= 0) {
        items[idx] = { ...items[idx], count: items[idx].count + delta };
      } else {
        items.push({
          id: await nextItemId(),
          count: delta,
          orderId: order.id,
          productArticle: action.productArticle
        });
      }
      break;
    }
    case 'remove': {
      items = items.filter(i => i.productArticle !== action.productArticle);
      break;
    }
    case 'setCount': {
      const exact = Math.floor(action.count);
      const idx = items.findIndex(i => i.productArticle === action.productArticle);
      if (idx < 0) {
        if (exact > 0) {
          items.push({
            id: await nextItemId(),
            count: exact,
            orderId: order.id,
            productArticle: action.productArticle
          });
        }
      } else {
        if (exact <= 0) items.splice(idx, 1);
        else items[idx] = { ...items[idx], count: exact };
      }
      break;
    }
  }

  const updated: OrderCookie = { ...order, items, updatedAt: nowISO() };

  const encoded = encodeURIComponent(JSON.stringify(updated));
  await writeRawCookie(COOKIE_NAME, encoded, COOKIE_MAX_AGE_SECONDS);

  return updated;
}

/** Очистить корзину: полностью удалить cookie `orders` */
export async function clearOrderCookie(): Promise<void> {
  await deleteRawCookie(COOKIE_NAME);
}

/** (опционально) Сбросить счётчики id */
export async function resetOrderCounters(): Promise<void> {
  await deleteRawCookie(ORDER_ID_KEY);
  await deleteRawCookie(ITEM_ID_KEY);
}

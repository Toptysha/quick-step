import type { NextApiRequest, NextApiResponse } from 'next';
import {
  PrismaClient,
  OrderFeedback,
  OrderPayMethod,
  OrderDeliveryMethod,
  OrderStatus,
} from '@/generated/prisma'; // ← твой путь к сгенерированным типам

const prisma = new PrismaClient();

// Несколько chat_id через запятую
const TG_TOKEN = process.env.TG_BOT_TOKEN || '';
const TG_CHAT_IDS = (process.env.TG_CHAT_ID || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// ===== Тип входящего payload (от фронта) =====
type CheckoutPayload = {
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    preferredContact?: {
      method: 'call' | 'sms' | 'telegram' | 'whatsapp';
      handle?: string | null;
    };
  };
  delivery: {
    type: 'courier' | 'pickup';
    pickup?: { id: string; address?: string | null } | null;
    address?: {
      city?: string;
      street?: string;
      house?: string | null;
      apartment?: string | null;
    } | null;
  };
  // ВАЖНО: ты поменял Prisma enum -> link есть в БД
  payment: 'card' | 'cash' | 'link' | 'split';
  comment?: string | null;
  order: {
    id: number;
    items: Array<{
      article: string;
      name: string;
      count: number;
      priceOfPack: number;
      lineTotal: number;
    }>;
    totals: { itemsCount: number; amount: number };
  };
};

// ===== Утилиты =====
function fmt(n: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(n);
}
function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderMessage(saved: {
  orderId: number;
  p: CheckoutPayload;
  dbItems: Array<{ name: string; article: string; count: number; priceOfPack: number; lineTotal: number }>;
}) {
  const { orderId, p, dbItems } = saved;

  const lines = dbItems
    .map(
      (i) =>
        `• <b>${escapeHtml(i.name)}</b>\n   арт. <code>${escapeHtml(
          i.article
        )}</code>\n   ${i.count} × ${fmt(i.priceOfPack)} = <b>${fmt(i.lineTotal)}</b>`
    )
    .join('\n');

  const deliveryText =
    p.delivery.type === 'courier'
      ? `Курьер${
          p.delivery.address
            ? `\nАдрес: ${[p.delivery.address.city, p.delivery.address.street, p.delivery.address.house, p.delivery.address.apartment]
                .filter(Boolean)
                .join(', ')}`
            : ''
        }`
      : `Самовывоз${p.delivery.pickup?.address ? `\nПункт: ${p.delivery.pickup.address}` : ''}`;

  const contactPref = p.customer.preferredContact
    ? `\nСвязь: ${p.customer.preferredContact.method}${
        p.customer.preferredContact.handle ? ` (${escapeHtml(p.customer.preferredContact.handle)})` : ''
      }`
    : '';

  const payText =
    p.payment === 'card' ? 'Картой' :
    p.payment === 'cash' ? 'Наличными' :
    p.payment === 'link' ? 'По ссылке / QR' :
    'Яндекс Сплит';

  const comment = p.comment ? `\nКомментарий: ${escapeHtml(p.comment)}` : '';

  return (
    `<b>Новый заказ</b>\n` +
    `Дата: ${new Date(p.createdAt).toLocaleString('ru-RU')}\n\n` +
    `<b>Клиент</b>\n` +
    `Имя: ${escapeHtml(p.customer.name)}\n` +
    `Телефон: ${escapeHtml(p.customer.phone)}` +
    `${contactPref}\n\n` +
    `<b>Доставка</b>\n${deliveryText}\n\n` +
    `<b>Оплата</b>\n${payText}` +
    (comment ? `${comment}\n` : '\n') +
    `\n<b>Заказ #${orderId}</b>\n` +
    `${lines}\n\n` +
    `<b>Итого:</b> ${fmt(p.order.totals.amount)} (${p.order.totals.itemsCount} шт.)`
  );
}

// ===== Маппинг фронтовых значений → Prisma enum =====
function mapFeedback(m?: CheckoutPayload['customer']['preferredContact']): OrderFeedback {
  const method = m?.method;
  if (method === 'sms') return OrderFeedback.sms;
  if (method === 'telegram') return OrderFeedback.telegram;
  if (method === 'whatsapp') return OrderFeedback.whatsapp;
  return OrderFeedback.call;
}

function mapPayMethod(p: CheckoutPayload['payment']): OrderPayMethod {
  if (p === 'cash') return OrderPayMethod.cash;
  if (p === 'link') return OrderPayMethod.link; // ← ты обновил enum в БД
  if (p === 'split') return OrderPayMethod.split;
  return OrderPayMethod.card;
}

// ⛔️ Исправление: сюда передаём ТОЛЬКО p.delivery, а не весь payload!
function mapDelivery(d: CheckoutPayload['delivery']): { method: OrderDeliveryMethod; address: string } {
  if (d.type === 'pickup') {
    const addr = d.pickup?.address || '';
    return { method: OrderDeliveryMethod.pickup, address: addr };
  }
  const s = d.address;
  const addr = [s?.city, s?.street, s?.house, s?.apartment].filter(Boolean).join(', ');
  return { method: OrderDeliveryMethod.courier, address: addr };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  if (!TG_TOKEN || TG_CHAT_IDS.length === 0) {
    return res.status(500).json({ error: 'Telegram credentials are missing (TG_BOT_TOKEN/TG_CHAT_ID)' });
  }

  try {
    const p = req.body as CheckoutPayload;

    // Мини-валидация
    if (!p?.customer?.name || !p?.customer?.phone || !Array.isArray(p?.order?.items) || p.order.items.length === 0) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Готовим данные для БД
    const favouriteFeedback = mapFeedback(p.customer.preferredContact);
    const payMethod = mapPayMethod(p.payment);
    const { method: deliveryMethod, address } = mapDelivery(p.delivery); // ← ВАЖНО: p.delivery

    // Найдём продукты по артикулам
    const articles = [...new Set(p.order.items.map((i) => i.article))];
    const products = await prisma.product.findMany({
      where: { article: { in: articles } },
      select: { id: true, article: true, name: true },
    });

    const productByArticle = new Map(products.map((pr) => [pr.article, pr]));
    const notFound = articles.filter((a) => !productByArticle.has(a));
    if (notFound.length) {
      return res.status(400).json({ error: `Products not found by article: ${notFound.join(', ')}` });
    }

    // Транзакция: создаем Order + OrderItem[]
    const saved = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          status: OrderStatus.processing,
          userName: p.customer.name.trim(),
          phone: p.customer.phone,
          favouriteFeedback,
          deliveryMethod,
          address,
          payMethod,
          comment: p.comment || null,
        },
        select: { id: true },
      });

      await tx.orderItem.createMany({
        data: p.order.items.map((i) => ({
          orderId: order.id,
          productId: productByArticle.get(i.article)!.id,
          count: i.count,
        })),
      });

      return order;
    });

    // Сообщение для Telegram
    const dbItems = p.order.items.map((i) => ({
      article: i.article,
      name: i.name,
      count: i.count,
      priceOfPack: i.priceOfPack,
      lineTotal: i.lineTotal,
    }));

    const text = renderMessage({ orderId: saved.id, p, dbItems });

    for (const chatId of TG_CHAT_IDS) {
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }).catch(() => {});
    }

    return res.status(200).json({ ok: true, orderId: saved.id });
  } catch (e: any) {
    console.error('checkout error:', e);
    return res.status(500).json({ error: e?.message || 'Internal server error' });
  }
}

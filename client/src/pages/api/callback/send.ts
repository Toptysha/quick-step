import type { NextApiRequest, NextApiResponse } from 'next';

const TOKEN = process.env.TG_BOT_TOKEN;
const CHAT_IDS: number[] = process.env.TG_CHAT_IDS ? JSON.parse(process.env.TG_CHAT_IDS) : [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    if (!TOKEN || CHAT_IDS.length === 0) throw new Error('TG_BOT_TOKEN/TG_CHAT_IDS не заданы');

    const { name, phone, question, method } = req.body || {};
    if (!name || !phone) {
      return res.status(400).json({ error: 'Имя и телефон обязательны' });
    }

    const referer = req.headers.referer || '';
    const methodLabel =
      method === 'sms' ? 'SMS' :
      method === 'telegram' ? 'Telegram' :
      method === 'whatsapp' ? 'WhatsApp' : 'Звонок';

    const text =
`🆕 <b>Заявка на консультацию</b>
<b>Имя:</b> ${escapeHtml(String(name))}
<b>Телефон:</b> ${escapeHtml(String(phone))}
<b>Связь:</b> ${methodLabel}
<b>Вопрос:</b> ${escapeHtml(String(question || '-'))}
<b>Страница:</b> ${escapeHtml(String(referer))}`;

    // отправляем ВСЕМ администраторам
    for (const chatId of CHAT_IDS) {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
      }).catch(() => {});
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error('callback/send error:', e);
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}

// простая экранизация для HTML parse_mode
function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

import type { NextApiRequest, NextApiResponse } from 'next';

const TOKEN = process.env.TG_BOT_TOKEN;
const CHAT_ID = process.env.TG_CHAT_ID; // ваш chat_id или id группы
// const TG_TOKEN = process.env.TG_BOT_TOKEN || '';
// const TG_CHAT_IDS = (process.env.TG_CHAT_ID || '')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    if (!TOKEN || !CHAT_ID) throw new Error('TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID не заданы');

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

    const tgResp = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
    });

    const j = await tgResp.json();
    if (!tgResp.ok || !j.ok) {
      throw new Error(j?.description || 'Telegram API error');
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

# app/utils/render.py
from __future__ import annotations
from typing import Any, Iterable
from html import escape

def _escape(s: Any) -> str:
    return escape(str(s or ""), quote=True)

def _get(obj: Any, names: Iterable[str], default: Any = "") -> Any:
    for name in names:
        if hasattr(obj, name):
            return getattr(obj, name)
    return default

def _get_dt(obj: Any, names: Iterable[str]) -> str:
    dt = _get(obj, names, None)
    try:
        return dt.strftime("%d.%m.%Y %H:%M")
    except Exception:
        return "-"

def _fmt_money(n: float | int) -> str:
    try:
        # «34 293 ₽»
        return f"{round(float(n)):,.0f}".replace(",", " ").replace("\xa0", " ") + " ₽"
    except Exception:
        return f"{n} ₽"

def _status_human(s: str | None) -> str:
    return {
        "processing": "обрабатывается",
        "done": "обработано",
        "canceled": "заказ отменен",
    }.get((s or "").lower(), s or "-")

def _feedback_human(s: str | None) -> str:
    return {
        "call": "call",
        "sms": "sms",
        "telegram": "telegram",
        "whatsapp": "whatsapp",
    }.get((s or "").lower(), s or "-")

def _pay_human(s: str | None) -> str:
    return {
        "card": "Картой",
        "cash": "Наличными",
        "link": "По ссылке / QR",
        "qrcode": "По ссылке / QR",  # на всякий случай
        "split": "Яндекс Сплит",
    }.get((s or "").lower(), s or "-")

def _delivery_human(method: str | None, address: str | None) -> tuple[str, str]:
    m = (method or "").lower()
    addr = address or ""
    if m == "pickup":
        return "Самовывоз", ("Пункт: " + _escape(addr) if addr else "-")
    if m == "courier":
        return "Курьер", (_escape(addr) if addr else "-")
    return m or "-", _escape(addr)

def _items_lines_and_totals(order: Any) -> tuple[list[str], int, float]:
    """Строки вида:
       • <b>Имя</b>\n   арт. <code>article</code>\n   6 × 2 476 ₽ = <b>14 856 ₽</b>
    """
    items = _get(order, ("items",), []) or []
    lines: list[str] = []
    total_amount = 0.0
    total_count = 0

    for oi in items:
        product = _get(oi, ("product",), None)
        name = _get(product, ("name",), "") or "-"
        article = _get(product, ("article",), "") or "-"
        price = _get(product, ("priceOfPack", "price_of_pack"), 0.0) or 0.0
        count = int(_get(oi, ("count",), 0) or 0)
        line_sum = float(price) * count

        total_amount += line_sum
        total_count += count

        lines.append(
            f"• <b>{_escape(name)}</b>\n"
            f"   арт. <code>{_escape(article)}</code>\n"
            f"   {count} × {_fmt_money(price)} = <b>{_fmt_money(line_sum)}</b>"
        )

    return lines, total_count, total_amount

# --------- ПУБЛИЧНЫЕ РЕНДЕРЫ ---------

def render_order_compact(o: Any) -> str:
    order_id = _get(o, ("id",), "-")
    status = _status_human(_get(o, ("status",), ""))
    created = _get_dt(o, ("createdAt", "created_at"))
    updated = _get_dt(o, ("updatedAt", "updated_at"))

    # коротко: клиент, 2 первые позиции
    user_name = _get(o, ("userName", "user_name", "username", "name"), "")
    phone = _get(o, ("phone", "phone_number", "tel"), "")
    phone_link = f'<a href="tel:{_escape(phone)}">{_escape(phone)}</a>' if phone else "-"

    head = (
        f"<b>Заказ #{_escape(order_id)}</b>\n"
        f"Статус: <b>{_escape(status)}</b>\n"
        f"Создан: {created}\n"
        f"Обновлён: {updated}\n\n"
        f"<b>Клиент:</b> {_escape(user_name)} / {phone_link}\n"
    )

    items = _get(o, ("items",), []) or []
    preview_lines: list[str] = []
    for oi in items[:2]:
        product = _get(oi, ("product",), None)
        name = _get(product, ("name",), "") or "-"
        article = _get(product, ("article",), "") or "-"
        count = int(_get(oi, ("count",), 0) or 0)
        preview_lines.append(f"• {_escape(name)} (<code>{_escape(article)}</code>) × {count}")

    if preview_lines:
        head += "\n<b>Состав:</b>\n" + "\n".join(preview_lines)

    return head

def render_order_full(o: Any) -> str:
    order_id = _get(o, ("id",), "-")
    status = _status_human(_get(o, ("status",), ""))
    created = _get_dt(o, ("createdAt", "created_at"))
    updated = _get_dt(o, ("updatedAt", "updated_at"))

    # Клиент
    user_name = _get(o, ("userName", "user_name", "username", "name"), "")
    phone = _get(o, ("phone", "phone_number", "tel"), "")
    phone_link = f'<a href="tel:{_escape(phone)}">{_escape(phone)}</a>' if phone else "-"

    fav = _feedback_human(_get(o, ("favouriteFeedback", "favorite_feedback", "favourite_feedback"), ""))

    # Доставка
    method = _get(o, ("deliveryMethod", "delivery_method"), "")
    address = _get(o, ("address", "delivery_address"), "")
    delivery_title, delivery_sub = _delivery_human(method, address)

    # Оплата
    pay = _pay_human(_get(o, ("payMethod", "pay_method", "payment", "payment_method"), ""))

    # Комментарий
    comment = _get(o, ("comment",), "") or None

    # Позиции и итоги по текущим ценам из Product.priceOfPack
    item_lines, items_count, amount = _items_lines_and_totals(o)
    items_text = "\n".join(item_lines) if item_lines else "—"

    text = (
        f"<b>Заказ #{_escape(order_id)}</b>\n"
        f"Статус: <b>{_escape(status)}</b>\n"
        f"Создан: {created}\n"
        f"Обновлён: {updated}\n\n"

        f"<b>Клиент</b>\n"
        f"Имя: {_escape(user_name) if user_name else '-'}\n"
        f"Телефон: {phone_link}\n"
        f"Связь: {fav}\n\n"

        f"<b>Доставка</b>\n"
        f"{delivery_title}\n"
        f"{delivery_sub}\n\n"

        f"<b>Оплата</b>\n"
        f"{pay}\n"
        f"{('Комментарий: ' + _escape(comment)) if comment else ''}\n\n"

        f"<b>Заказ #{_escape(order_id)}</b>\n"
        f"{items_text}\n\n"

        f"<b>Итого:</b> {_fmt_money(amount)} ({items_count} шт.)"
    ).strip()

    return text

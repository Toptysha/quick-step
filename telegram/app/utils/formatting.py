from app.models import Order, OrderItem
from zoneinfo import ZoneInfo
from datetime import datetime
from app.config import settings

RU_STATUS = {
    "processing": "обрабатывается",
    "done": "обработано",
    "canceled": "заказ отменен",
}

tz = ZoneInfo(settings.TIMEZONE)

def fmt_dt(dt: datetime | None) -> str:
    if not dt:
        return "-"
    try:
        return dt.astimezone(tz).strftime("%Y-%m-%d %H:%M")
    except Exception:
        return dt.strftime("%Y-%m-%d %H:%M")

def format_order(order: Order) -> str:
    parts = [
        f"<b>Заказ #{order.id}</b>",
        f"Статус: <b>{RU_STATUS.get(order.status, order.status)}</b>",
        f"Создан: {fmt_dt(order.createdAt)}",
        f"Обновлён: {fmt_dt(order.updatedAt)}",
    ]

    # Позиции
    if order.items:
        parts.append("\n<b>Состав:</b>")
        for it in order.items:
            name = it.product.name if it.product else "—"
            art = f" ({it.product.article})" if it.product and it.product.article else ""
            parts.append(f"• {name}{art} × {it.count}")
    else:
        parts.append("\nСостав: —")

    return "\n".join(parts)

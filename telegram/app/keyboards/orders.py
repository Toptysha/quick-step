from __future__ import annotations
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

def kb_order(order_id: int, status: str, expanded: bool) -> InlineKeyboardMarkup:
    # переключатель компакт/детально
    toggle = InlineKeyboardButton(
        text=("🔽 Показать детали" if not expanded else "🔼 Скрыть детали"),
        callback_data=f"ord|toggle|{order_id}|{'1' if not expanded else '0'}",
    )

    # статусы
    btn_processing = InlineKeyboardButton(
        text="🛠️ Обрабатывается",
        callback_data=f"ord|status|{order_id}|processing",
    )
    btn_done = InlineKeyboardButton(
        text="✅ Обработано",
        callback_data=f"ord|status|{order_id}|done",
    )
    btn_canceled = InlineKeyboardButton(
        text="❌ Заказ отменен",
        callback_data=f"ord|status|{order_id}|canceled",
    )
    # удалить
    btn_delete = InlineKeyboardButton(
        text="🗑️ Удалить заказ",
        callback_data=f"ord|delete|{order_id}",
    )

    # можно подсветить текущий статус галочкой — телеграм не поддерживает toggle на самих кнопках,
    # но мы можем просто оставить текст одинаковым, а актуальный статус виден в заголовке.

    rows = [
        [toggle],
        [btn_processing],
        [btn_done],
        [btn_canceled],
        [btn_delete],
    ]
    return InlineKeyboardMarkup(inline_keyboard=rows)

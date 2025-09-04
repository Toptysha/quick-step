# from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

# def order_actions_kb(order_id: int) -> InlineKeyboardMarkup:
#     return InlineKeyboardMarkup(inline_keyboard=[
#         [InlineKeyboardButton(text="🛠 Обрабатывается", callback_data=f"order:st:{order_id}:processing")],
#         [InlineKeyboardButton(text="✅ Обработано",    callback_data=f"order:st:{order_id}:done")],
#         [InlineKeyboardButton(text="❌ Заказ отменен", callback_data=f"order:st:{order_id}:canceled")],
#         [InlineKeyboardButton(text="🗑 Удалить заказ", callback_data=f"order:del:{order_id}")]
#     ])

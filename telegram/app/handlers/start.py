# app/handlers/start.py
from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message

router = Router(name="start")

HELP_TEXT = (
    "Доступные команды:\n\n"
    "<pre><code>/all_orders [N|day|week|month|year]</code></pre>"
    "Показать заказы (компакт). В карточке можно развернуть детали.\n\n"
    "<pre><code>/orders_processing [N|day|week|month|year]</code></pre>"
    "Заказы в статусе «обрабатывается».\n\n"
    "<pre><code>/orders_done [N|day|week|month|year]</code></pre>"
    "Заказы «обработано».\n\n"
    "<pre><code>/orders_canceled [N|day|week|month|year]</code></pre>"
    "Заказы «заказ отменен».\n\n"
    "В карточке заказа доступны кнопки: изменить статус, удалить, показать/скрыть детали."
)

@router.message(Command("start"))
async def cmd_start(msg: Message):
    await msg.reply("Привет! Я бот заказов.\n\n" + HELP_TEXT)

@router.message(Command("help"))
async def cmd_help(msg: Message):
    await msg.reply(HELP_TEXT)

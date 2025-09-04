# app/bot.py
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

from app.config import settings
from app.handlers import start as start_handler
from app.handlers import orders as orders_handler

def build_bot() -> tuple[Bot, Dispatcher]:
    bot = Bot(
        settings.BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)  # ← вместо parse_mode="HTML"
    )
    dp = Dispatcher()
    dp.include_router(start_handler.router)
    dp.include_router(orders_handler.router)
    return bot, dp

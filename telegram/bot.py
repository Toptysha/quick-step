import os
import json
import asyncio
import enum
from datetime import datetime, timedelta, timezone
from typing import Optional, Literal, List

from aiogram import Bot, Dispatcher, F, Router
from aiogram.filters import Command, CommandObject
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery
from aiogram.exceptions import TelegramBadRequest

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse

from pydantic import BaseModel, Field
from sqlalchemy import (
    create_engine, select, func, text, String, DateTime, Integer, Enum, JSON as SA_JSON
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncAttrs, AsyncSession

from dotenv import load_dotenv

# -----------------------------
# ENV / CONFIG
# -----------------------------
load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()
if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN не задан в .env")

ADMIN_IDS = [int(x) for x in os.getenv("ADMIN_IDS", "").replace(" ", "").split(",") if x]
USE_WEBHOOK = os.getenv("USE_WEBHOOK", "false").lower() == "true"
WEBAPP_HOST = os.getenv("WEBAPP_HOST", "0.0.0.0")
WEBAPP_PORT = int(os.getenv("WEBAPP_PORT", "8000"))
WEBHOOK_BASE = os.getenv("WEBHOOK_BASE", "").rstrip("/")

# База SQLite (асинхронно)
DB_URL = os.getenv("DB_URL")

MOSCOW_TZ = timezone(timedelta(hours=3))


# -----------------------------
# DB MODELS
# -----------------------------
class Base(AsyncAttrs, DeclarativeBase):
    pass

class OrderStatus(str, enum.Enum):
    processing = "обрабатывается"
    done = "обработано"
    canceled = "заказ отменен"

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus), default=OrderStatus.processing, nullable=False)
    source: Mapped[str] = mapped_column(String(50), default="site")  # откуда пришло (site/api/…)
    data: Mapped[dict] = mapped_column(SA_JSON, default=dict)        # произвольные данные заказа (имя, телефон, корзина, суммы и т.д.)

# Async engine & session
async_engine = create_async_engine(DB_URL, echo=False, future=True)
AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(async_engine, expire_on_commit=False)


async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# -----------------------------
# BOT INIT
# -----------------------------
bot = Bot(BOT_TOKEN, parse_mode="HTML")
dp = Dispatcher()
router = Router()
dp.include_router(router)

# -----------------------------
# HELPERS
# -----------------------------
def is_admin(user_id: int) -> bool:
    return user_id in ADMIN_IDS

def status_to_slug(s: OrderStatus | str) -> str:
    # для команд /orders_processing etc.
    if isinstance(s, OrderStatus):
        ru = s.value
    else:
        ru = s
    mapping = {
        OrderStatus.processing.value: "processing",
        OrderStatus.done.value: "done",
        OrderStatus.canceled.value: "canceled",
    }
    return mapping.get(ru, "processing")

def slug_to_status(slug: str) -> OrderStatus:
    slug = slug.lower()
    if slug in ("processing", "обрабатывается"):
        return OrderStatus.processing
    if slug in ("done", "обработано", "accepted", "accept"):
        return OrderStatus.done
    if slug in ("canceled", "cancelled", "заказ отменен", "отменен", "отменён"):
        return OrderStatus.canceled
    # по умолчанию
    return OrderStatus.processing

def human_dt(dt: datetime) -> str:
    # Перевод в «парижское» время для отображения
    local = dt.astimezone(MOSCOW_TZ)
    return local.strftime("%Y-%m-%d %H:%M")

def build_status_kb(order_id: int) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🛠 Обрабатывается", callback_data=f"st:{order_id}:processing")],
        [InlineKeyboardButton(text="✅ Обработано", callback_data=f"st:{order_id}:done")],
        [InlineKeyboardButton(text="❌ Заказ отменен", callback_data=f"st:{order_id}:canceled")],
    ])

async def order_text(o: Order) -> str:
    # Короткий текст карточки заказа
    parts = [
        f"<b>Заказ #{o.id}</b>",
        f"Статус: <b>{o.status.value}</b>",
        f"Создан: {human_dt(o.created_at)}",
    ]
    # Удобно показать ключевые поля, если есть
    name = o.data.get("name") or o.data.get("customer_name")
    phone = o.data.get("phone") or o.data.get("customer_phone")
    total = o.data.get("total") or o.data.get("amount")
    if name: parts.append(f"Имя: {name}")
    if phone: parts.append(f"Телефон: {phone}")
    if total: parts.append(f"Сумма: {total}")

    # Если нужно — короткий JSON (обрезаем)
    raw = json.dumps(o.data, ensure_ascii=False)
    if len(raw) > 700:
        raw = raw[:700] + "…"
    parts.append(f"<code>{raw}</code>")
    return "\n".join(parts)

async def notify_admins_new_order(o: Order):
    text = await order_text(o)
    kb = build_status_kb(o.id)
    for admin_id in ADMIN_IDS:
        try:
            await bot.send_message(admin_id, f"🆕 Поступил новый заказ:\n\n{text}", reply_markup=kb)
        except TelegramBadRequest:
            pass


def parse_period(arg: Optional[str]) -> Optional[tuple[datetime, datetime]]:
    if not arg:
        return None
    now = datetime.now(timezone.utc)
    arg = arg.lower()
    if arg.isdigit():
        # это не период, а кол-во — вернём None, обработает другой блок
        return None
    if arg in ("day", "today"):
        start = now - timedelta(days=1)
    elif arg in ("week",):
        start = now - timedelta(days=7)
    elif arg in ("month",):
        start = now - timedelta(days=30)
    elif arg in ("year",):
        start = now - timedelta(days=365)
    else:
        return None
    return (start, now)

def parse_count_or_period(arg: Optional[str]) -> tuple[Optional[int], Optional[tuple[datetime, datetime]]]:
    if not arg:
        return (None, None)
    if arg.isdigit():
        return (int(arg), None)
    per = parse_period(arg)
    return (None, per) if per else (None, None)


async def fetch_orders(session: AsyncSession,
                       status: Optional[OrderStatus] = None,
                       limit: Optional[int] = None,
                       period: Optional[tuple[datetime, datetime]] = None):
    stmt = select(Order).order_by(Order.id.desc())
    if status:
        stmt = stmt.filter(Order.status == status)
    if period:
        start, end = period
        stmt = stmt.filter(Order.created_at >= start, Order.created_at <= end)
    if limit:
        stmt = stmt.limit(limit)
    res = await session.execute(stmt)
    return list(res.scalars())


# -----------------------------
# FASTAPI (приём заказов с сайта)
# -----------------------------
class IncomingOrder(BaseModel):
    # Примерные поля — вы можете отправлять любые, всё попадёт в .data
    order_id: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    total: Optional[float] = None
    items: Optional[list] = Field(default_factory=list)
    meta: Optional[dict] = Field(default_factory=dict)

api = FastAPI()

@api.post("/orders/new")
async def new_order_endpoint(payload: IncomingOrder, request: Request):
    # Сайт шлёт POST JSON — сохраняем заказ со статусом "обрабатывается"
    async with AsyncSessionLocal() as session:
        order = Order(
            status=OrderStatus.processing,
            source="site",
            data=json.loads(payload.model_dump_json())
        )
        session.add(order)
        await session.commit()
        await session.refresh(order)

    # Уведомим админов
    await notify_admins_new_order(order)

    return JSONResponse({"ok": True, "order_id": order.id})


# -----------------------------
# BOT COMMANDS
# -----------------------------
@router.message(Command("start"))
async def cmd_start(msg: Message):
    await msg.reply(
        "Привет! Я бот заказов.\n\n"
        "• Сайт может присылать заказы через POST /orders/new (см. инструкцию)\n"
        "• Админы получают уведомления и могут управлять статусами.\n\n"
        "Команды для админов:\n"
        "/all_orders [N|day|week|month|year]\n"
        "/orders_processing [N|day|week|month|year]\n"
        "/orders_done [N|day|week|month|year]\n"
        "/orders_canceled [N|day|week|month|year]\n"
        "/set_status <order_id> <processing|done|canceled>\n"
    )

def admin_only(func):
    async def wrapper(msg: Message, *args, **kwargs):
        if not is_admin(msg.from_user.id):
            return await msg.reply("Доступно только администраторам.")
        return await func(msg, *args, **kwargs)
    return wrapper

@router.message(Command("all_orders"))
@admin_only
async def cmd_all_orders(msg: Message, command: CommandObject):
    arg = (command.args or "").strip() or None
    limit, period = parse_count_or_period(arg)
    async with AsyncSessionLocal() as session:
        orders = await fetch_orders(session, None, limit, period)
    if not orders:
        return await msg.reply("Заказов не найдено.")
    # Отсылаем как отдельные сообщения (удобно с inline‑кнопками)
    for o in orders:
        await msg.answer(await order_text(o), reply_markup=build_status_kb(o.id))

async def _status_cmd(msg: Message, command: CommandObject, status: OrderStatus):
    arg = (command.args or "").strip() or None
    limit, period = parse_count_or_period(arg)
    async with AsyncSessionLocal() as session:
        orders = await fetch_orders(session, status, limit, period)
    if not orders:
        return await msg.reply("Заказов не найдено.")
    for o in orders:
        await msg.answer(await order_text(o), reply_markup=build_status_kb(o.id))

@router.message(Command("orders_processing"))
@admin_only
async def cmd_orders_processing(msg: Message, command: CommandObject):
    await _status_cmd(msg, command, OrderStatus.processing)

@router.message(Command("orders_done"))
@admin_only
async def cmd_orders_done(msg: Message, command: CommandObject):
    await _status_cmd(msg, command, OrderStatus.done)

@router.message(Command("orders_canceled"))
@admin_only
async def cmd_orders_canceled(msg: Message, command: CommandObject):
    await _status_cmd(msg, command, OrderStatus.canceled)

@router.message(Command("set_status"))
@admin_only
async def cmd_set_status(msg: Message, command: CommandObject):
    # /set_status 15 done
    if not command.args:
        return await msg.reply("Использование: /set_status <order_id> <processing|done|canceled>")
    try:
        parts = command.args.split()
        order_id = int(parts[0])
        new_status = slug_to_status(parts[1]) if len(parts) > 1 else OrderStatus.processing
    except Exception:
        return await msg.reply("Неверные аргументы. Пример: /set_status 15 done")

    async with AsyncSessionLocal() as session:
        o = await session.get(Order, order_id)
        if not o:
            return await msg.reply(f"Заказ #{order_id} не найден.")
        o.status = new_status
        await session.commit()
        await session.refresh(o)

    await msg.reply(f"Статус заказа #{order_id} изменён на: <b>{new_status.value}</b>")

# Inline‑кнопки смены статуса
@router.callback_query(F.data.startswith("st:"))
async def cb_change_status(cq: CallbackQuery):
    if not is_admin(cq.from_user.id):
        return await cq.answer("Только для админов", show_alert=True)
    try:
        _, sid, slug = cq.data.split(":")
        order_id = int(sid)
        new_status = slug_to_status(slug)
    except Exception:
        return await cq.answer("Ошибка формата", show_alert=True)

    async with AsyncSessionLocal() as session:
        o = await session.get(Order, order_id)
        if not o:
            return await cq.answer("Заказ не найден", show_alert=True)
        o.status = new_status
        await session.commit()
        await session.refresh(o)

    # Обновим кнопки и текст
    try:
        await cq.message.edit_text(await order_text(o), reply_markup=build_status_kb(o.id))
    except TelegramBadRequest:
        pass
    await cq.answer(f"Статус: {new_status.value}")

# -----------------------------
# STARTUP / WEBHOOK / POLLING
# -----------------------------
@api.on_event("startup")
async def on_startup():
    await init_db()
    if USE_WEBHOOK:
        # Настраиваем вебхук на /tg/webhook
        webhook_url = f"{WEBHOOK_BASE}/tg/webhook"
        await bot.set_webhook(webhook_url)
    else:
        # Убираем вебхук на всякий случай
        try:
            await bot.delete_webhook(drop_pending_updates=True)
        except:
            pass
    print("✅ Startup complete")

@api.post("/tg/webhook")
async def tg_webhook(request: Request):
    if not USE_WEBHOOK:
        raise HTTPException(403, "Webhook disabled")
    update = await request.json()
    await dp.feed_update(bot, update)
    return JSONResponse({"ok": True})

# Фоновый запуск long polling, если не вебхук
async def _run_polling():
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())

def main():
    if USE_WEBHOOK:
        # Запускаем только веб‑сервер FastAPI (webhook дергает бота)
        import uvicorn
        uvicorn.run(api, host=WEBAPP_HOST, port=WEBAPP_PORT)
    else:
        # Запускаем FastAPI + параллельно polling
        import uvicorn
        loop = asyncio.get_event_loop()

        async def runner():
            config = uvicorn.Config(api, host=WEBAPP_HOST, port=WEBAPP_PORT, log_level="info")
            server = uvicorn.Server(config)
            # Запустим сервер и polling одновременно
            poll_task = asyncio.create_task(_run_polling())
            await server.serve()
            # Если сервер остановлен — завершим polling
            if not poll_task.done():
                poll_task.cancel()

        loop.run_until_complete(runner())

if __name__ == "__main__":
    main()

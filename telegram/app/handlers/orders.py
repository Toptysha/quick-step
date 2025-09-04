# telegram/app/handlers/orders.py
from __future__ import annotations
from typing import Optional, Literal

from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, CallbackQuery

from sqlalchemy.ext.asyncio import AsyncSession

from app.utils.permissions import AdminOnly
from app.db import async_session_maker  # ← используем фабрику сессий напрямую
from app.repositories.orders import list_orders, get_order, set_status, delete_order
from app.keyboards.orders import kb_order
from app.utils.render import render_order_compact, render_order_full

router = Router(name="orders")
router.message.filter(AdminOnly())
router.callback_query.filter(AdminOnly())

# ---------- helpers ----------
def _parse_args(text: str) -> tuple[Optional[int], Optional[Literal["day","week","month","year"]]]:
    """
    Разбираем /all_orders [N|day|week|month|year]
    """
    parts = text.strip().split(maxsplit=1)
    if len(parts) == 1:
        return None, None
    arg = parts[1].strip().lower()
    if arg in {"day","week","month","year"}:
        return None, arg  # period
    try:
        n = int(arg)
        return n, None
    except:
        return None, None

async def _send_order(msg_or_cb, order, expanded: bool):
    text = render_order_full(order) if expanded else render_order_compact(order)
    kb = kb_order(order.id, order.status, expanded)
    if isinstance(msg_or_cb, Message):
        await msg_or_cb.answer(text, reply_markup=kb)
    else:
        await msg_or_cb.message.edit_text(text, reply_markup=kb)
        await msg_or_cb.answer()

# ---------- commands ----------
@router.message(Command("all_orders"))
async def cmd_all_orders(message: Message):
    limit, period = _parse_args(message.text or "")
    async with async_session_maker() as session:  # ← открываем сессию тут
        orders = await list_orders(session, status=None, limit=limit, period=period)  # type: ignore
        if not orders:
            await message.answer("Заказы не найдены.")
            return
        for o in orders:
            await _send_order(message, o, expanded=False)

@router.message(Command("orders_processing"))
async def cmd_orders_processing(message: Message):
    limit, period = _parse_args(message.text or "")
    async with async_session_maker() as session:
        orders = await list_orders(session, status="processing", limit=limit, period=period)  # type: ignore
        if not orders:
            await message.answer("Заказы со статусом «обрабатывается» не найдены.")
            return
        for o in orders:
            await _send_order(message, o, expanded=False)

@router.message(Command("orders_done"))
async def cmd_orders_done(message: Message):
    limit, period = _parse_args(message.text or "")
    async with async_session_maker() as session:
        orders = await list_orders(session, status="done", limit=limit, period=period)  # type: ignore
        if not orders:
            await message.answer("Заказы со статусом «обработано» не найдены.")
            return
        for o in orders:
            await _send_order(message, o, expanded=False)

@router.message(Command("orders_canceled"))
async def cmd_orders_canceled(message: Message):
    limit, period = _parse_args(message.text or "")
    async with async_session_maker() as session:
        orders = await list_orders(session, status="canceled", limit=limit, period=period)  # type: ignore
        if not orders:
            await message.answer("Заказы со статусом «заказ отменен» не найдены.")
            return
        for o in orders:
            await _send_order(message, o, expanded=False)

# ---------- callbacks ----------
@router.callback_query(F.data.startswith("ord|"))
async def on_order_action(cb: CallbackQuery):
    """
    Формат callback_data:
      ord|toggle|<order_id>|<1/0>      - показать/скрыть детали
      ord|status|<order_id>|<status>   - изменить статус (processing|done|canceled)
      ord|delete|<order_id>            - удалить заказ
    """
    try:
        parts = (cb.data or "").split("|")
        _, action, order_id_s, *rest = parts
        order_id = int(order_id_s)
    except Exception:
        await cb.answer("Некорректные данные", show_alert=True)
        return

    async with async_session_maker() as session:
        if action == "toggle":
            expanded = rest and rest[0] == "1"
            order = await get_order(session, order_id)
            if not order:
                await cb.answer("Заказ не найден", show_alert=True)
                return
            await _send_order(cb, order, expanded=expanded)
            return

        if action == "status":
            if not rest:
                await cb.answer("Не указан статус", show_alert=True)
                return
            new_status = rest[0]
            if new_status not in {"processing","done","canceled"}:
                await cb.answer("Неизвестный статус", show_alert=True)
                return
            order = await set_status(session, order_id, new_status)  # type: ignore
            if not order:
                await cb.answer("Заказ не найден", show_alert=True)
                return
            await _send_order(cb, order, expanded=False)
            await cb.answer("Статус обновлён")
            return

        if action == "delete":
            ok = await delete_order(session, order_id)
            if not ok:
                await cb.answer("Заказ не найден", show_alert=True)
                return
            try:
                await cb.message.delete()
            except Exception:
                await cb.message.edit_text("Заказ удалён.")
            await cb.answer("Заказ удалён")
            return

        await cb.answer("Неизвестное действие", show_alert=True)

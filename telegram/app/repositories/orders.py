from __future__ import annotations
from datetime import datetime, timedelta, timezone
from typing import Literal, Optional, Sequence

from sqlalchemy import select, desc, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Order, OrderItem, Product

Period = Optional[Literal["day", "week", "month", "year"]]
OrderStatusStr = Literal["processing", "done", "canceled"]

def _period_cut(period: Period) -> Optional[datetime]:
    if not period:
        return None
    now = datetime.now(timezone.utc)
    if period == "day":
        return now - timedelta(days=1)
    if period == "week":
        return now - timedelta(weeks=1)
    if period == "month":
        return now - timedelta(days=30)
    if period == "year":
        return now - timedelta(days=365)
    return None

async def list_orders(
    session: AsyncSession,
    *,
    status: Optional[OrderStatusStr] = None,
    limit: Optional[int] = None,
    period: Period = None,
) -> Sequence[Order]:
    stmt = (
        select(Order)
        .options(
            selectinload(Order.items).selectinload(OrderItem.product)
        )
        .order_by(desc(Order.createdAt))
    )
    if status:
        stmt = stmt.where(Order.status == status)
    cut = _period_cut(period)
    if cut:
        stmt = stmt.where(Order.createdAt >= cut)
    if limit:
        stmt = stmt.limit(limit)
    res = await session.execute(stmt)
    return res.scalars().all()

async def get_order(session: AsyncSession, order_id: int) -> Optional[Order]:
    stmt = (
        select(Order)
        .where(Order.id == order_id)
        .options(selectinload(Order.items).selectinload(OrderItem.product))
    )
    res = await session.execute(stmt)
    return res.scalars().first()

async def set_status(session: AsyncSession, order_id: int, status: OrderStatusStr) -> Optional[Order]:
    order = await get_order(session, order_id)
    if not order:
        return None
    order.status = status  # SQLAlchemy отслеживает
    await session.commit()
    await session.refresh(order)
    return order

async def delete_order(session: AsyncSession, order_id: int) -> bool:
    order = await get_order(session, order_id)
    if not order:
        return False
    await session.delete(order)
    await session.commit()
    return True

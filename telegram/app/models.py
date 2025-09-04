# app/models.py
from __future__ import annotations

from typing import List, Optional
from datetime import datetime

from sqlalchemy import (
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    text,
)
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
)
from sqlalchemy.dialects.postgresql import ENUM as PG_ENUM, ARRAY as PG_ARRAY
from sqlalchemy.sql import func
from sqlalchemy.sql.elements import quoted_name  # ✅ правильный импорт


# =========================
# Declarative Base
# =========================
class Base(DeclarativeBase):
    pass


# =========================
# PostgreSQL ENUM'ы (созданы Prisma; мы только ИСПОЛЬЗУЕМ)
# =========================
OrderStatusEnum = PG_ENUM(
    "processing", "done", "canceled",
    name="OrderStatus", create_type=False,
)
OrderFeedbackEnum = PG_ENUM(
    "call", "sms", "telegram", "whatsapp",
    name="OrderFeedback", create_type=False,
)
OrderPayMethodEnum = PG_ENUM(
    "card", "cash", "link", "split",
    name="OrderPayMethod", create_type=False,
)
OrderDeliveryMethodEnum = PG_ENUM(
    "pickup", "courier",
    name="OrderDeliveryMethod", create_type=False,
)


# =========================
# OrderItem -> "OrderItem"
# =========================
class OrderItem(Base):
    __tablename__ = quoted_name("OrderItem", True)

    id: Mapped[int] = mapped_column("id", Integer, primary_key=True, autoincrement=True)
    count: Mapped[int] = mapped_column("count", Integer, nullable=False, server_default=text("1"))

    # ❗ FK без кавычек — совпадает с ключом таблицы в MetaData
    orderId: Mapped[int] = mapped_column(
        "orderId",
        ForeignKey("Order.id", ondelete="CASCADE"),
        nullable=False,
    )
    productId: Mapped[int] = mapped_column(
        "productId",
        ForeignKey("Product.id"),
        nullable=False,
    )

    product: Mapped["Product"] = relationship(
        "Product",
        back_populates="orderItems",
        primaryjoin="foreign(OrderItem.productId) == Product.id",
        foreign_keys=[productId],
        lazy="selectin",
    )

    order: Mapped["Order"] = relationship(
        "Order",
        back_populates="items",
        primaryjoin="foreign(OrderItem.orderId) == Order.id",
        foreign_keys=[orderId],
        lazy="selectin",
    )


# =========================
# Product -> "Product"
# =========================
class Product(Base):
    __tablename__ = quoted_name("Product", True)

    id: Mapped[int] = mapped_column("id", Integer, primary_key=True, autoincrement=True)
    cover: Mapped[str] = mapped_column("cover", String, nullable=False)
    photos: Mapped[Optional[list[str]]] = mapped_column("photos", PG_ARRAY(String), nullable=True)
    article: Mapped[str] = mapped_column("article", String, unique=True, nullable=False)
    name: Mapped[str] = mapped_column("name", String, nullable=False)
    title: Mapped[Optional[str]] = mapped_column("title", String, nullable=True)
    # enum ProductType в Prisma; нам достаточно строки
    type: Mapped[str] = mapped_column("type", String, nullable=False)
    priceOfPack: Mapped[Optional[float]] = mapped_column("priceOfPack", Float, nullable=True)
    priceOfMSqare: Mapped[Optional[float]] = mapped_column("priceOfMSqare", Float, nullable=True)
    remains: Mapped[int] = mapped_column("remains", Integer, nullable=False)
    description: Mapped[Optional[list[str]]] = mapped_column("description", PG_ARRAY(String), nullable=True)
    isVisible: Mapped[bool] = mapped_column("isVisible", Boolean, nullable=False, server_default=text("true"))
    createdAt: Mapped[datetime] = mapped_column(
        "createdAt", DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    orderItems: Mapped[List[OrderItem]] = relationship(
        "OrderItem",
        back_populates="product",
        primaryjoin="Product.id == foreign(OrderItem.productId)",
        foreign_keys=[OrderItem.productId],
        lazy="selectin",
    )


# =========================
# Order -> "Order"
# =========================
class Order(Base):
    __tablename__ = quoted_name("Order", True)

    id: Mapped[int] = mapped_column("id", Integer, primary_key=True, autoincrement=True)

    status: Mapped[str] = mapped_column(
        "status", OrderStatusEnum, nullable=False,
        server_default=text("'processing'::\"OrderStatus\""),
    )

    # Поля из Prisma (camelCase имена колонок!)
    userName: Mapped[str] = mapped_column("userName", String, nullable=False)
    phone: Mapped[str] = mapped_column("phone", String, nullable=False)
    favouriteFeedback: Mapped[str] = mapped_column("favouriteFeedback", OrderFeedbackEnum, nullable=False)
    deliveryMethod: Mapped[str] = mapped_column("deliveryMethod", OrderDeliveryMethodEnum, nullable=False)
    address: Mapped[str] = mapped_column("address", String, nullable=False)
    payMethod: Mapped[str] = mapped_column("payMethod", OrderPayMethodEnum, nullable=False)
    comment: Mapped[Optional[str]] = mapped_column("comment", String, nullable=True)

    createdAt: Mapped[datetime] = mapped_column(
        "createdAt", DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updatedAt: Mapped[datetime] = mapped_column(
        "updatedAt", DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    items: Mapped[List[OrderItem]] = relationship(
        "OrderItem",
        back_populates="order",
        primaryjoin="Order.id == foreign(OrderItem.orderId)",
        foreign_keys=[OrderItem.orderId],
        lazy="selectin",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

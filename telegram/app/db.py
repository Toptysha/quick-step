# app/db.py
from __future__ import annotations

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool

from app.config import settings

def _to_async_url(url: str) -> str:
    """
    Преобразует sync URL вида
      postgresql://user:pass@host:5432/db
    в async:
      postgresql+asyncpg://user:pass@host:5432/db
    Если префикс уже async — возвращаем как есть.
    """
    if url.startswith("postgresql+asyncpg://"):
        return url
    if url.startswith("postgresql://"):
        return "postgresql+asyncpg://" + url[len("postgresql://") :]
    return url  # оставим как есть, если вдруг другой драйвер

ASYNC_DATABASE_URL = _to_async_url(settings.DATABASE_URL)

# Создаём async-engine
engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    poolclass=NullPool,  # чтобы не держать соединения в долгоживущем боте (по желанию)
)

# Фабрика async-сессий
async_session_maker = async_sessionmaker(
    engine,
    expire_on_commit=False,
)

# app/utils/permissions.py
from __future__ import annotations

from typing import Iterable, Union
from aiogram.filters import BaseFilter
from aiogram.types import Message, CallbackQuery

from app.config import settings


def _to_int_set(items: Iterable[Union[str, int]]) -> set[int]:
    out: set[int] = set()
    for x in items:
        try:
            out.add(int(x))
        except Exception:
            continue
    return out


class AdminOnly(BaseFilter):
    """
    Пропускает только пользователей из списка ADMIN_IDS.
    Работает и для Message, и для CallbackQuery.
    """
    def __init__(self, admins: Iterable[Union[str, int]] | None = None) -> None:
        # settings.ADMIN_IDS может быть list[str] или list[int] — нормализуем к set[int]
        self.admins: set[int] = _to_int_set(admins or settings.ADMIN_IDS)

    async def __call__(self, event: Union[Message, CallbackQuery]) -> bool:
        user = getattr(event, "from_user", None)
        return bool(user and user.id in self.admins)

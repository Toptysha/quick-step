from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List
import os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    BOT_TOKEN: str
    ADMIN_IDS: List[int] = []
    DATABASE_URL: str = "postgresql://postgres:qwerty123@localhost:5432/quick_step"

    USE_WEBHOOK: bool = False
    WEBHOOK_BASE: str = ""
    WEBAPP_HOST: str = "0.0.0.0"
    WEBAPP_PORT: int = 8000

    TIMEZONE: str = "Europe/Moscow"

    @field_validator("ADMIN_IDS", mode="before")
    @classmethod
    def parse_admin_ids(cls, v):
        if isinstance(v, list):
            return v
        if not v:
            return []
        return [int(x) for x in str(v).replace(" ", "").split(",") if x]

settings = Settings()

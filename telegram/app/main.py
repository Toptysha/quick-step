import asyncio
from app.bot import build_bot

async def main():
    bot, dp = build_bot()
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())

if __name__ == "__main__":
    asyncio.run(main())

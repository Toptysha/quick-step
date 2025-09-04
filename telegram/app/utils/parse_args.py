from datetime import datetime, timedelta

def parse_arg_count_or_period(arg: str | None):
    """
    Принимает либо число N, либо один из day/week/month/year.
    Возвращает (limit:int|None, period:(start,end)|None).
    Времена — naive UTC (подходит для большинства БД конфигов).
    """
    if not arg:
        return None, None

    arg = arg.strip().lower()
    if arg.isdigit():
        return int(arg), None

    now = datetime.utcnow()
    if arg in ("day", "today"):
        return None, (now - timedelta(days=1), now)
    if arg == "week":
        return None, (now - timedelta(days=7), now)
    if arg == "month":
        return None, (now - timedelta(days=30), now)
    if arg == "year":
        return None, (now - timedelta(days=365), now)

    return None, None

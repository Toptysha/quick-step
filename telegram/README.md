## Установка

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# впишите BOT_TOKEN, ADMIN_IDS, DATABASE_URL
python -m app.main

Команды:


/start & /help - показывает все команды
/my_id - получаем Telegram chat_id
/all_orders [N|day|week|month|year]
/orders_processing [N|day|week|month|year]
/orders_done [N|day|week|month|year]
/orders_canceled [N|day|week|month|year]
/set_status <order_id> <processing|done|canceled>
/delete_order <order_id>
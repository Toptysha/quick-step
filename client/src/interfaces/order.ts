export interface OrderItem {
  id: number;              // локальный id позиции в рамках куки
  count: number;           // количество
  orderId: number;         // id заказа (совпадает с order.id)
  productArticle: string;  // уникальный ключ товара (вместо productId)
}

export interface OrderCookie {
  id: number;
  status: 'processing' | 'done' | 'canceled';
  createdAt: string; // ISO
  updatedAt: string; // ISO
  items: OrderItem[];
}
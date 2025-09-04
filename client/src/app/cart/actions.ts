'use server';

import { OrderCookie } from "@/interfaces";
import { getOrder, updateOrder } from "@/utils";

export async function readCart(): Promise<OrderCookie | null> {
  return getOrder();
}

export async function addItem(article: string, qty = 1): Promise<OrderCookie> {
  return updateOrder({ type: 'add', productArticle: article, count: qty });
}

export async function removeItem(article: string): Promise<OrderCookie> {
  return updateOrder({ type: 'remove', productArticle: article });
}

export async function setItemQty(article: string, qty: number): Promise<OrderCookie> {
  return updateOrder({ type: 'setCount', productArticle: article, count: qty });
}

export async function clearCart(): Promise<OrderCookie> {
  return updateOrder({ type: 'clear' });
}

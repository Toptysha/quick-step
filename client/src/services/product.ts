import { Product } from "@/interfaces";

export const createProduct = async (product: Product) => {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!res.ok) throw new Error("Ошибка при создании продукта");

  return res.json();
};

export const getProduct = async (article: string) => {
  const res = await fetch(`/api/products/${article}`);
  if (!res.ok) throw new Error("Продукт не найден");

  return res.json();
};

export const getAllProducts = async () => {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Не удалось получить список продуктов");

  return res.json();
};

export const deleteProduct = async (article: string) => {
  const res = await fetch(`/api/products/${article}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Ошибка при удалении продукта");

  return true;
};

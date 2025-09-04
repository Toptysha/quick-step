import { PrismaClient } from "@/generated/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { path, description } = req.body;
  if (!path || typeof description !== "string") {
    return res.status(400).json({ error: "Неверные данные" });
  }

  try {
    await prisma.cover.update({
      where: { path },
      data: { description },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Ошибка при обновлении:", err);
    res.status(500).json({ error: "Не удалось обновить cover" });
  }
}
import { PrismaClient } from "@/generated/prisma";
import { unlink } from "fs/promises";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).end();

  const { path: coverPath } = req.body;

  if (!coverPath) {
    return res.status(400).json({ error: "path обязателен" });
  }

  try {
    // Удаление из базы
    await prisma.cover.delete({ where: { path: coverPath } });

    // Удаление физического файла
    const filePath = path.join(process.cwd(), "public", coverPath);
    await unlink(filePath);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Ошибка при удалении cover:", err);
    res.status(500).json({ error: "Ошибка при удалении" });
  }
}

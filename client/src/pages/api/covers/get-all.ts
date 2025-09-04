import { PrismaClient } from "@/generated/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const covers = await prisma.cover.findMany({ orderBy: { id: "desc" } });
    res.status(200).json(covers);
  } catch (error) {
    console.error("Ошибка при получении covers:", error);
    res.status(500).json({ error: "Ошибка при получении данных" });
  }
}

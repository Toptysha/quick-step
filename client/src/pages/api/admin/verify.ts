import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@/generated/prisma";
import { parse } from "cookie";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.admin_token;

  if (!token) {
    return res.status(401).json({ error: "Не авторизован" });
  }

  const admin = await prisma.admin.findFirst({ where: { token } });
  if (!admin) {
    return res.status(401).json({ error: "Недействительный токен" });
  }

  return res.status(200).json({ success: true });
}

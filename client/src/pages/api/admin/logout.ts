import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@/generated/prisma";
import { parse, serialize } from "cookie";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.admin_token;

  if (token) {
    await prisma.admin.updateMany({
      where: { token },
      data: { token: null },
    });
  }

  res.setHeader("Set-Cookie", serialize("admin_token", "", {
    path: "/",
    maxAge: -1,
  }));

  res.status(200).json({ success: true });
}

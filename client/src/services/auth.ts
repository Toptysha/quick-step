import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function isAdmin(token: string | undefined) {
  if (!token) return false;

  const admin = await prisma.admin.findFirst({
    where: { token },
  });

  return !!admin;
}

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

/**
 * POST /api/switcher-options/add
 * body: { field: string; value: string }
 * Добавляет значение в массив, если его там нет
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { field, value } = req.body ?? {};
  if (!field || typeof field !== "string" || !value || typeof value !== "string") {
    return res.status(400).json({ error: "Invalid body. Expect { field: string; value: string }" });
  }

  try {
    const current = await prisma.switcherOptions.findUnique({ where: { id: 1 } });
    if (!current) {
      await prisma.switcherOptions.create({
        data: {
          id: 1,
          productTypes: [],
          manufacturers: [],
          collections: [],
          colors: [],
          chamfersCount: [],
          chamfersType: [],
          typeOfConnection: [],
          compatibilityWithHeating: [],
          waterResistance: [],
          wearResistanceClass: [],
          assurance: [],
          lookLike: [],
          lengths: [],
          widths: [],
          heights: [],
        },
      });
    }

    // @ts-expect-error — проверим ниже
    const arr: string[] | undefined = current?.[field];
    if (!Array.isArray(arr)) {
      return res.status(400).json({ error: `Unknown or non-array field "${field}"` });
    }

    if (arr.includes(value)) {
      return res.status(200).json({ ok: true, message: "Already exists" });
    }

    const next = [...arr, value];

    const updated = await prisma.switcherOptions.update({
      where: { id: 1 },
      data: {
        [field]: next,
      },
    });

    return res.status(200).json(updated);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Server error" });
  }
}

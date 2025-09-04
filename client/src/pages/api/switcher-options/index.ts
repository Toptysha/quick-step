import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

/**
 * GET  /api/switcher-options      -> вернуть единственную запись (id=1)
 * PUT  /api/switcher-options      -> частично обновить массивы (Partial), тело: { fieldName: string[]; ... }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      let data = await prisma.switcherOptions.findUnique({ where: { id: 1 } });
      if (!data) {
        data = await prisma.switcherOptions.create({
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
            // ↓ новые сортировки по умолчанию
            sortings: ["стандартная", "по возрастанию цены", "по убыванию цены"],
          },
        });
      } else if (!data.sortings) {
        // на случай, если поле добавили позже — проставим дефолт
        data = await prisma.switcherOptions.update({
          where: { id: 1 },
          data: { sortings: ["стандартная", "по возрастанию цены", "по убыванию цены"] },
        });
      }
      return res.status(200).json(data);
    }

    if (req.method === "PUT") {
      const payload = req.body ?? {};
      const allowedFields = new Set([
        "productTypes",
        "manufacturers",
        "collections",
        "colors",
        "chamfersCount",
        "chamfersType",
        "typeOfConnection",
        "compatibilityWithHeating",
        "waterResistance",
        "wearResistanceClass",
        "assurance",
        "lookLike",
        "lengths",
        "widths",
        "heights",
        "sortings", // ← разрешаем обновлять
      ]);

      const data: Record<string, string[]> = {};
      for (const [k, v] of Object.entries(payload)) {
        if (allowedFields.has(k) && Array.isArray(v)) {
          data[k] = v.map(String);
        }
      }

      const updated = await prisma.switcherOptions.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data },
      });

      return res.status(200).json(updated);
    }

    res.setHeader("Allow", "GET,PUT");
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Server error" });
  }
}

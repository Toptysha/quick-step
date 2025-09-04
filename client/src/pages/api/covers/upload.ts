import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@/generated/prisma";
import { IncomingForm } from "formidable";
import { mkdir, copyFile, unlink } from "fs/promises";
import path from "path";

export const config = {
  api: { bodyParser: false },
};

const prisma = new PrismaClient();

function getFirstString(val: string | string[] | undefined): string | undefined {
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val[0];
  return undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Ошибка загрузки:", err);
      return res.status(500).json({ error: "Ошибка загрузки" });
    }

    const type = getFirstString(fields.type) || "default";
    const description = getFirstString(fields.description);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file || !("filepath" in file)) {
      return res.status(400).json({ error: "Файл не получен" });
    }

    const originalName = file.originalFilename?.split(".")[0] || "cover";
    const ext = path.extname(file.originalFilename || ".jpg");
    const filename = `${originalName}-${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public/uploads", type || "default");

    const publicPath = `/uploads/${type}/${filename}`.replace(/\\/g, "/");

    const fullPath = path.join(uploadDir, filename);

    try {
      await mkdir(uploadDir, { recursive: true });
      await copyFile(file.filepath, fullPath);
      await unlink(file.filepath);

      const cover = await prisma.cover.create({
        data: {
          path: publicPath,
          type: type || "default",
          description: description || "",
        },
      });

      return res.status(200).json({ success: true, cover });
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      return res.status(500).json({ error: "Не удалось сохранить cover" });
    }
  });
}

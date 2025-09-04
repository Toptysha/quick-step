import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const form = new IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Ошибка разбора формы:', err);
      return res.status(500).json({ error: 'Ошибка при разборе формы' });
    }

    const uploaded = files.file;
    const file: File | undefined = Array.isArray(uploaded) ? uploaded[0] : uploaded;

    const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
    const article = Array.isArray(fields.article) ? fields.article[0] : fields.article;

    if (!file || !type || !article) {
      return res.status(400).json({ error: 'Недостаточно данных' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products', article, type);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const tempPath = file.filepath;
    const fileName = file.originalFilename || 'uploaded_file';
    const newFilePath = path.join(uploadDir, fileName);

    fs.copyFileSync(tempPath, newFilePath);

    return res.status(200).json({
      success: true,
      path: `/uploads/products/${article}/${type}/${fileName}`,
    });
  });
}

import { PrismaClient } from '@/generated/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/* ===================== Constants ===================== */

const TECH_KEYS = [
  'manufacturer','collection','color','chamfersCount','chamfersType',
  'typeOfConnection','compatibilityWithHeating','waterResistance',
  'wearResistanceClass','assurance','lookLike',
] as const;
type TechKeys = typeof TECH_KEYS[number];

/* ===================== Util: TechnicalData ===================== */

/** Берём значение из разных форматов: "строка" | { value: string } | null/undefined */
function readTechValue(input: any): string | null {
  if (input === null || input === undefined) return null;
  if (typeof input === 'object' && 'value' in input) {
    const v = (input as any).value;
    return v === '' || v === undefined || v === null ? null : String(v);
  }
  const s = String(input);
  return s === '' ? null : s;
}

/** Приводим весь объект technicalData к { key: string | null } строго по белому списку */
function toTechRecord(technicalData: any): Record<TechKeys, string | null> {
  const out = {} as Record<TechKeys, string | null>;
  for (const k of TECH_KEYS) {
    out[k] = readTechValue(technicalData?.[k]);
  }
  return out;
}

/* ===================== FS helpers ===================== */

async function tryUnlink(fullPath: string) {
  try {
    await fs.promises.unlink(fullPath);
    console.log('[FS] deleted:', fullPath);
  } catch (e: any) {
    if (e?.code !== 'ENOENT') {
      console.warn('[FS] unlink warn:', fullPath, e?.message);
    }
  }
}

function normalizeStoredPath(storedPath: string): string {
  if (!storedPath) return '';
  const noOrigin = storedPath.replace(/^https?:\/\/[^/]+/i, '');
  return noOrigin.startsWith('/') ? noOrigin.slice(1) : noOrigin;
}

function buildFsCandidates(stored: string): string[] {
  const rel = normalizeStoredPath(stored);
  const cwd = process.cwd();
  return [
    path.join(cwd, rel),
    path.join(cwd, 'public', rel),
    path.join(cwd, 'uploads', path.basename(rel)),
  ];
}

async function deleteStoredFile(storedPath: string) {
  if (!storedPath) return;
  const candidates = buildFsCandidates(storedPath);
  for (const p of candidates) await tryUnlink(p);
}

async function deleteStoredFiles(paths: string[]) {
  await Promise.all(paths.map(deleteStoredFile));
}

async function renameProductDir(oldArticle: string, newArticle: string) {
  const base = path.join(process.cwd(), 'public', 'uploads', 'products');
  const from = path.join(base, oldArticle);
  const to = path.join(base, newArticle);
  await fs.promises.mkdir(base, { recursive: true });

  try { await fs.promises.access(from, fs.constants.F_OK); }
  catch { return; }

  try {
    await fs.promises.mkdir(to, { recursive: true });
    const items = await fs.promises.readdir(from);
    for (const name of items) {
      await fs.promises.rename(path.join(from, name), path.join(to, name));
    }
    await fs.promises.rm(from, { recursive: true, force: true });
  } catch (e: any) {
    try { await fs.promises.rename(from, to); }
    catch (e2: any) {
      if (e2?.code !== 'ENOENT') console.warn('[FS] rename dir warn:', from, '->', to, e2?.message);
    }
  }
}

async function deleteProductDir(article: string) {
  const dirPath = path.join(process.cwd(), 'public', 'uploads', 'products', article);
  try { await fs.promises.rm(dirPath, { recursive: true, force: true }); }
  catch (e: any) {
    if (e?.code !== 'ENOENT') console.warn('[FS] rm warn:', dirPath, e?.message);
  }
}

function replaceArticleInPath(storedPath: string, oldArticle: string, newArticle: string): string {
  const s = normalizeStoredPath(storedPath);
  const aOld = `uploads/products/${oldArticle}/`;
  const aNew = `uploads/products/${newArticle}/`;
  if (s.includes(aOld)) return s.replace(aOld, aNew);
  if (('/' + s).includes('/' + aOld)) return s.replace(aOld, aNew);
  return s;
}

function projectPathsToNewArticle(paths: string[] = [], oldArticle: string, newArticle: string): string[] {
  return paths.map((p) => replaceArticleInPath(p, oldArticle, newArticle));
}

/* ===================== Handler ===================== */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { productArticle } = req.query;
  if (typeof productArticle !== 'string') {
    return res.status(400).json({ error: 'Invalid productArticle' });
  }

  if (req.method === 'GET') {
    const product = await prisma.product.findUnique({
      where: { article: productArticle },
      include: { floorCharacteristics: true, floorSize: true, technicalData: true },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.status(200).json(product);
  }

  if (req.method === 'PUT') {
    try {
      const data = req.body as any;

      const current = await prisma.product.findUnique({ where: { article: productArticle } });
      if (!current) return res.status(404).json({ error: 'Product not found' });

      const productId = current.id;
      const oldArticle = current.article;
      const newArticle: string = data.article || oldArticle;
      const isArticleChanged = newArticle !== oldArticle;

      const incomingPhotosRaw: string[] = Array.isArray(data.photos) ? data.photos : [];
      const incomingCoverRaw: string | null = data.cover ?? null;

      const incomingPhotos = isArticleChanged
        ? projectPathsToNewArticle(incomingPhotosRaw, oldArticle, newArticle)
        : incomingPhotosRaw;

      const incomingCover = isArticleChanged && incomingCoverRaw
        ? replaceArticleInPath(incomingCoverRaw, oldArticle, newArticle)
        : incomingCoverRaw;

      const projectedCurrentCover = isArticleChanged
        ? replaceArticleInPath(current.cover, oldArticle, newArticle)
        : current.cover;

      const projectedCurrentPhotos = isArticleChanged
        ? projectPathsToNewArticle(current.photos || [], oldArticle, newArticle)
        : (current.photos || []);

      const removedPhotos = projectedCurrentPhotos.filter((p) => !incomingPhotos.includes(p));
      const coverChanged = Boolean(incomingCover) && (incomingCover !== projectedCurrentCover);
      const oldCoverToDelete = coverChanged ? projectedCurrentCover : null;

      if (isArticleChanged) {
        await renameProductDir(oldArticle, newArticle);
      }

      await prisma.product.update({
        where: { id: productId },
        data: {
          article: newArticle,
          name: data.name,
          cover: incomingCover as string,
          title: data.title,
          type: data.type,
          priceOfPack: data.priceOfPack ?? null,
          priceOfMSqare: data.priceOfMSqare ?? null,
          remains: data.remains,
          description: Array.isArray(data.description) ? data.description : [],
          isVisible: data.isVisible ?? true,
          photos: incomingPhotos,
        },
      });

      await prisma.floorCharacteristic.deleteMany({ where: { productId } });
      if (Array.isArray(data.floorCharacteristics) && data.floorCharacteristics.length) {
        await prisma.floorCharacteristic.createMany({
          data: data.floorCharacteristics.map((fc: any) => ({
            title: fc.title,
            description: fc.description,
            productId,
          })),
        });
      }

      if (data.floorSize) {
        await prisma.floorSize.upsert({
          where: { productId },
          create: {
            length: data.floorSize.length ?? null,
            width: data.floorSize.width ?? null,
            height: data.floorSize.height ?? null,
            mSqareOfPack: data.floorSize.mSqareOfPack ?? null,
            countOfPack: data.floorSize.countOfPack ?? null,
            productId,
          },
          update: {
            length: data.floorSize.length ?? null,
            width: data.floorSize.width ?? null,
            height: data.floorSize.height ?? null,
            mSqareOfPack: data.floorSize.mSqareOfPack ?? null,
            countOfPack: data.floorSize.countOfPack ?? null,
          },
        });
      } else {
        await prisma.floorSize.deleteMany({ where: { productId } });
      }

      // ✅ Главное: тех.данные понимают и старый, и новый формат
      if (data.technicalData) {
        const techRecord = toTechRecord(data.technicalData);
        await prisma.technicalData.upsert({
          where: { productId },
          create: { ...techRecord, productId },
          update: techRecord,
        });
      } else {
        await prisma.technicalData.deleteMany({ where: { productId } });
      }

      const deletions: Promise<any>[] = [];
      if (removedPhotos.length) deletions.push(deleteStoredFiles(removedPhotos));
      if (oldCoverToDelete) deletions.push(deleteStoredFile(oldCoverToDelete));
      await Promise.all(deletions);

      const full = await prisma.product.findUnique({
        where: { id: productId },
        include: { floorCharacteristics: true, floorSize: true, technicalData: true },
      });

      return res.status(200).json(full);
    } catch (err: any) {
      console.error('PUT /api/products/[productArticle] error:', err);
      return res.status(400).json({ error: err.message || 'Unknown error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const product = await prisma.product.findUnique({ where: { article: productArticle } });
      if (!product) return res.status(404).json({ error: 'Product not found' });

      const productId = product.id;

      const toDelete: string[] = [];
      if (product.cover) toDelete.push(product.cover);
      if (Array.isArray(product.photos) && product.photos.length) toDelete.push(...product.photos);
      if (toDelete.length) await deleteStoredFiles(toDelete);

      await deleteProductDir(product.article);

      await prisma.$transaction([
        prisma.floorCharacteristic.deleteMany({ where: { productId } }),
        prisma.floorSize.deleteMany({ where: { productId } }),
        prisma.technicalData.deleteMany({ where: { productId } }),
        prisma.product.delete({ where: { id: productId } }),
      ]);

      return res.status(204).end();
    } catch (err: any) {
      console.error('DELETE /api/products/[productArticle] error:', err);
      return res.status(400).json({ error: err.message || 'Unknown error' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

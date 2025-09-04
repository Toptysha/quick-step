// client/src/pages/api/products/index.ts
import { PrismaClient, Prisma } from '@/generated/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '@/interfaces';

const prisma = new PrismaClient();

/** --- Ключи техданных, которые ищем по подстроке --- */
const TECH_KEYS = [
  'manufacturer','collection','color','chamfersCount','chamfersType',
  'typeOfConnection','compatibilityWithHeating','waterResistance',
  'wearResistanceClass','assurance','lookLike',
] as const;
type TechKey = typeof TECH_KEYS[number];

function readTechValue(input: any): string | null {
  if (input === null || input === undefined) return null;
  if (typeof input === 'object' && 'value' in input) {
    const v = (input as any).value;
    return v === '' || v === undefined || v === null ? null : String(v);
  }
  const s = String(input);
  return s === '' ? null : s;
}
function toTechRecord(technicalData: any): Record<TechKey, string | null> {
  const out = {} as Record<TechKey, string | null>;
  for (const k of TECH_KEYS) out[k] = readTechValue(technicalData?.[k]);
  return out;
}

/** --- Сортировка --- */
type SortKey = 'default' | 'price_asc' | 'price_desc';
function buildOrderBy(sort: SortKey): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case 'price_asc':
      // сначала те, у кого есть цена за м², затем по м², затем по цене за упаковку, как запасной вариант
      return [{ priceOfMSqare: 'asc' }, { priceOfPack: 'asc' }, { createdAt: 'asc' }];
    case 'price_desc':
      return [{ priceOfMSqare: 'desc' }, { priceOfPack: 'desc' }, { createdAt: 'asc' }];
    default:
      return [{ createdAt: 'asc' }];
  }
}

/** --- Поиск по тексту q --- */
function buildTextWhere(q: string): Prisma.ProductWhereInput | undefined {
  const term = q.trim();
  if (!term) return undefined;

  // Для массивов description postgres/Prisma не даёт подстрочный contains, только exact `has/hasSome`.
  // Оставим точное совпадение элемента массива для description, а главное — ищем по строковым полям и связям.
  return {
    OR: [
      { article: { contains: term, mode: 'insensitive' } },
      { name: { contains: term, mode: 'insensitive' } },
      { title: { contains: term, mode: 'insensitive' } },
      // { description: { has: term } }, // включить, если хотите точные совпадения по элементу массива
      {
        technicalData: {
          OR: [
            { manufacturer: { contains: term, mode: 'insensitive' } },
            { collection: { contains: term, mode: 'insensitive' } },
            { color: { contains: term, mode: 'insensitive' } },
            { chamfersCount: { contains: term, mode: 'insensitive' } },
            { chamfersType: { contains: term, mode: 'insensitive' } },
            { typeOfConnection: { contains: term, mode: 'insensitive' } },
            { compatibilityWithHeating: { contains: term, mode: 'insensitive' } },
            { waterResistance: { contains: term, mode: 'insensitive' } },
            { wearResistanceClass: { contains: term, mode: 'insensitive' } },
            { assurance: { contains: term, mode: 'insensitive' } },
            { lookLike: { contains: term, mode: 'insensitive' } },
          ],
        },
      },
      {
        floorCharacteristics: {
          some: {
            OR: [
              { title: { contains: term, mode: 'insensitive' } },
              { description: { contains: term, mode: 'insensitive' } },
            ],
          },
        },
      },
    ],
  };
}

/** --- Базовая фильтрация по типу товара (если нужно) --- */
function buildTypeWhere(type?: string): Prisma.ProductWhereInput | undefined {
  if (!type) return undefined;
  if (!['laminat', 'vinyl', 'accessory'].includes(type)) return undefined;
  return { type: type as any };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // query params: ?q=&page=&pageSize=&sort=&type=
      const q = typeof req.query.q === 'string' ? req.query.q : '';
      const page = Math.max(1, Number(req.query.page ?? 1) || 1);
      const pageSize = Math.max(1, Math.min(48, Number(req.query.pageSize ?? 9) || 9));
      const sort = (typeof req.query.sort === 'string' ? req.query.sort : 'default') as SortKey;
      const type = typeof req.query.type === 'string' ? req.query.type : undefined;

      const whereAND: Prisma.ProductWhereInput[] = [];

      const textWhere = buildTextWhere(q);
      if (textWhere) whereAND.push(textWhere);

      const typeWhere = buildTypeWhere(type);
      if (typeWhere) whereAND.push(typeWhere);

      const where: Prisma.ProductWhereInput = whereAND.length ? { AND: whereAND } : {};

      const orderBy = buildOrderBy(sort);

      const [total, items] = await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
          where,
          include: {
            floorCharacteristics: true,
            floorSize: true,
            technicalData: true,
          },
          orderBy,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      return res.status(200).json({
        items,
        total,
        page,
        pageSize,
        totalPages,
      });
    } catch (err: any) {
      console.error('GET /api/products error:', err);
      return res.status(500).json({ error: err?.message ?? 'Server error' });
    }
  }

  if (req.method === 'POST') {
    const data: Product & { technicalData?: any } = req.body;

    try {
      const product = await prisma.product.create({
        data: {
          article: data.article,
          name: data.name,
          cover: data.cover,
          title: data.title,
          type: data.type,
          priceOfPack: data.priceOfPack ?? null,
          priceOfMSqare: data.priceOfMSqare ?? null,
          remains: data.remains,
          isVisible: data.isVisible ?? true,
          description: data.description ?? [],
          photos: data.photos || [],

          floorCharacteristics: {
            create: data.floorCharacteristics || [],
          },

          floorSize: data.floorSize
            ? {
                create: {
                  length: data.floorSize.length ?? null,
                  width: data.floorSize.width ?? null,
                  height: data.floorSize.height ?? null,
                  mSqareOfPack: data.floorSize.mSqareOfPack ?? null,
                  countOfPack: data.floorSize.countOfPack ?? null,
                },
              }
            : undefined,

          technicalData: data.technicalData
            ? { create: toTechRecord(data.technicalData) }
            : undefined,
        },
        include: {
          floorCharacteristics: true,
          floorSize: true,
          technicalData: true,
        },
      });

      return res.status(201).json(product);
    } catch (err: any) {
      console.error('❌ Ошибка создания продукта:', err);
      return res.status(400).json({ error: err.message || 'Unknown error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

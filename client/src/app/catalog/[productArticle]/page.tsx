import { notFound } from "next/navigation";
import { PrismaClient } from "@/generated/prisma";
import ProductClientView from "./ProductClientView";
import { Product } from "@/interfaces";

const prisma = new PrismaClient();

type PageProps = {
  params: { productArticle: string };
};

export default async function ProductPage({ params }: PageProps) {
  const { productArticle } = params;

  // Грузим прямо из БД, без кэша
  const product = await prisma.product.findUnique({
    where: { article: productArticle },
    include: {
      floorCharacteristics: true,
      floorSize: true,
      technicalData: true,
    },
  });

  if (!product) {
    // это покажет app/catalog/[productArticle]/not-found.tsx
    notFound();
  }

  return <ProductClientView initialProduct={product as Product} />;
}

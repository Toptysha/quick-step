-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('laminat', 'vinyl', 'accessory');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "cover" TEXT NOT NULL,
    "photos" TEXT[],
    "article" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "type" "ProductType" NOT NULL,
    "priceOfPack" DOUBLE PRECISION,
    "priceOfMSqare" DOUBLE PRECISION NOT NULL,
    "remains" INTEGER NOT NULL,
    "description" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloorCharacteristic" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "FloorCharacteristic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloorSize" (
    "id" SERIAL NOT NULL,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "mSqareOfPack" DOUBLE PRECISION,
    "countOfPack" DOUBLE PRECISION,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "FloorSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalData" (
    "id" SERIAL NOT NULL,
    "manufacturer" TEXT,
    "collection" TEXT,
    "color" TEXT,
    "chamfersCount" TEXT,
    "chamfersType" TEXT,
    "typeOfConnection" TEXT,
    "compatibilityWithHeating" TEXT,
    "waterResistance" TEXT,
    "wearResistanceClass" TEXT,
    "assurance" TEXT,
    "lookLike" TEXT,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "TechnicalData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_article_key" ON "Product"("article");

-- CreateIndex
CREATE UNIQUE INDEX "FloorSize_productId_key" ON "FloorSize"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalData_productId_key" ON "TechnicalData"("productId");

-- AddForeignKey
ALTER TABLE "FloorCharacteristic" ADD CONSTRAINT "FloorCharacteristic_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloorSize" ADD CONSTRAINT "FloorSize_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalData" ADD CONSTRAINT "TechnicalData_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

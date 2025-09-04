-- CreateTable
CREATE TABLE "SwitcherOptions" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "productTypes" TEXT[],
    "manufacturers" TEXT[],
    "collections" TEXT[],
    "colors" TEXT[],
    "chamfersCount" TEXT[],
    "chamfersType" TEXT[],
    "typeOfConnection" TEXT[],
    "compatibilityWithHeating" TEXT[],
    "waterResistance" TEXT[],
    "wearResistanceClass" TEXT[],
    "assurance" TEXT[],
    "lookLike" TEXT[],
    "lengths" TEXT[],
    "widths" TEXT[],
    "heights" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SwitcherOptions_pkey" PRIMARY KEY ("id")
);

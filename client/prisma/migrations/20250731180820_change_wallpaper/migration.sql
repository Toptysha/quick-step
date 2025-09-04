/*
  Warnings:

  - You are about to drop the `Wallpaper` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Wallpaper";

-- CreateTable
CREATE TABLE "Cover" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Cover_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cover_path_key" ON "Cover"("path");

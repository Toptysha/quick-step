-- CreateTable
CREATE TABLE "Wallpaper" (
    "id" SERIAL NOT NULL,
    "photoPath" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Wallpaper_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallpaper_photoPath_key" ON "Wallpaper"("photoPath");

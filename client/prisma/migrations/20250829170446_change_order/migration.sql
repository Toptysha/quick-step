/*
  Warnings:

  - Added the required column `address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `favouriteFeedback` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderFeedback" AS ENUM ('call', 'sms', 'telegram', 'whatsapp');

-- CreateEnum
CREATE TYPE "OrderPayMethod" AS ENUM ('card', 'cash', 'qrCode', 'split');

-- CreateEnum
CREATE TYPE "OrderDeliveryMethod" AS ENUM ('pickup', 'courier');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "deliveryMethod" "OrderDeliveryMethod" NOT NULL,
ADD COLUMN     "favouriteFeedback" "OrderFeedback" NOT NULL,
ADD COLUMN     "payMethod" "OrderPayMethod" NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;

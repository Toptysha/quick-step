/*
  Warnings:

  - The values [qrCode] on the enum `OrderPayMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderPayMethod_new" AS ENUM ('card', 'cash', 'link', 'split');
ALTER TABLE "Order" ALTER COLUMN "payMethod" TYPE "OrderPayMethod_new" USING ("payMethod"::text::"OrderPayMethod_new");
ALTER TYPE "OrderPayMethod" RENAME TO "OrderPayMethod_old";
ALTER TYPE "OrderPayMethod_new" RENAME TO "OrderPayMethod";
DROP TYPE "OrderPayMethod_old";
COMMIT;

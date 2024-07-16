/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_productEan_fkey";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "productEan" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ALTER COLUMN "ean" SET DATA TYPE TEXT,
ALTER COLUMN "isbn" SET DATA TYPE TEXT,
ALTER COLUMN "upc" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("ean");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_productEan_fkey" FOREIGN KEY ("productEan") REFERENCES "Product"("ean") ON DELETE RESTRICT ON UPDATE CASCADE;

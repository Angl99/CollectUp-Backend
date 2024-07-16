/*
  Warnings:

  - You are about to drop the column `productId` on the `Item` table. All the data in the column will be lost.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Product` table. All the data in the column will be lost.
  - Added the required column `productEan` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_productId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "productId",
ADD COLUMN     "productEan" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("ean");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_productEan_fkey" FOREIGN KEY ("productEan") REFERENCES "Product"("ean") ON DELETE RESTRICT ON UPDATE CASCADE;

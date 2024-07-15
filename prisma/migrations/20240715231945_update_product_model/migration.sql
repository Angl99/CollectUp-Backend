/*
  Warnings:

  - You are about to drop the column `data` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ean` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "data",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "itemId",
DROP COLUMN "price",
DROP COLUMN "userId",
ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "ean" INTEGER NOT NULL,
ADD COLUMN     "isbn" INTEGER,
ADD COLUMN     "upc" INTEGER,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Product_id_seq";

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

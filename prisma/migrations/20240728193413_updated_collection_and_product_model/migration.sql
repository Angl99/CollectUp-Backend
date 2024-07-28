/*
  Warnings:

  - You are about to drop the column `collectionId` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_collectionId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "collectionId";

-- CreateTable
CREATE TABLE "CollectionProduct" (
    "collectionId" INTEGER NOT NULL,
    "productEan" TEXT NOT NULL,

    CONSTRAINT "CollectionProduct_pkey" PRIMARY KEY ("collectionId","productEan")
);

-- AddForeignKey
ALTER TABLE "CollectionProduct" ADD CONSTRAINT "CollectionProduct_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionProduct" ADD CONSTRAINT "CollectionProduct_productEan_fkey" FOREIGN KEY ("productEan") REFERENCES "Product"("ean") ON DELETE RESTRICT ON UPDATE CASCADE;

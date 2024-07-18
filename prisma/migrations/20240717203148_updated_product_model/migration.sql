/*
  Warnings:

  - You are about to drop the `ItemSeries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemSeries" DROP CONSTRAINT "ItemSeries_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemSeries" DROP CONSTRAINT "ItemSeries_seriesId_fkey";

-- DropTable
DROP TABLE "ItemSeries";

-- CreateTable
CREATE TABLE "ProductSeries" (
    "productEan" TEXT NOT NULL,
    "seriesId" INTEGER NOT NULL,

    CONSTRAINT "ProductSeries_pkey" PRIMARY KEY ("productEan","seriesId")
);

-- AddForeignKey
ALTER TABLE "ProductSeries" ADD CONSTRAINT "ProductSeries_productEan_fkey" FOREIGN KEY ("productEan") REFERENCES "Product"("ean") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSeries" ADD CONSTRAINT "ProductSeries_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

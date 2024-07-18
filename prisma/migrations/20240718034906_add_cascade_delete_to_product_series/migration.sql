-- DropForeignKey
ALTER TABLE "ProductSeries" DROP CONSTRAINT "ProductSeries_seriesId_fkey";

-- AddForeignKey
ALTER TABLE "ProductSeries" ADD CONSTRAINT "ProductSeries_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

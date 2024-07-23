/*
  Warnings:

  - Added the required column `searchableBrand` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `searchableDescription` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `searchableTitle` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "searchableBrand" TEXT NOT NULL,
ADD COLUMN     "searchableDescription" TEXT NOT NULL,
ADD COLUMN     "searchableTitle" TEXT NOT NULL;

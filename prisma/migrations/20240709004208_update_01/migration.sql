/*
  Warnings:

  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `street_address_1` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `street_address_2` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `zip_code` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "city",
DROP COLUMN "state",
DROP COLUMN "street_address_1",
DROP COLUMN "street_address_2",
DROP COLUMN "zip_code";

/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "createdAt",
DROP COLUMN "description";

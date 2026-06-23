/*
  Warnings:

  - You are about to drop the column `author` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "author",
ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

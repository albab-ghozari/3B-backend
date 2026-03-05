/*
  Warnings:

  - A unique constraint covering the columns `[nomor,gedung]` on the table `Kamar` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gedung` to the `Kamar` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Kamar_nomor_key";

-- AlterTable
ALTER TABLE "Kamar" ADD COLUMN     "gedung" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Kamar_nomor_gedung_key" ON "Kamar"("nomor", "gedung");

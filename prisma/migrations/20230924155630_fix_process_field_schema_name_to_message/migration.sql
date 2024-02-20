/*
  Warnings:

  - You are about to drop the column `messagem` on the `process` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `process` DROP COLUMN `messagem`,
    ADD COLUMN `message` VARCHAR(191) NULL;

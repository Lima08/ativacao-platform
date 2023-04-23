/*
  Warnings:

  - You are about to drop the column `companyId` on the `user_training` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_training` DROP FOREIGN KEY `user_training_companyId_fkey`;

-- AlterTable
ALTER TABLE `user_training` DROP COLUMN `companyId`;

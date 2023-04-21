/*
  Warnings:

  - You are about to drop the column `campaingId` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `trainings` table. All the data in the column will be lost.
  - You are about to drop the column `campaingId` on the `videos` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `campaigns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `trainings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `trainings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `images_campaingId_fkey`;

-- DropForeignKey
ALTER TABLE `videos` DROP FOREIGN KEY `videos_campaingId_fkey`;

-- AlterTable
ALTER TABLE `campaigns` ADD COLUMN `companyId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `images` DROP COLUMN `campaingId`,
    ADD COLUMN `campaignId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `trainings` DROP COLUMN `status`,
    ADD COLUMN `companyId` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `videos` DROP COLUMN `campaingId`,
    ADD COLUMN `campaignId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `videos` ADD CONSTRAINT `videos_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trainings` ADD CONSTRAINT `trainings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trainings` ADD CONSTRAINT `trainings_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

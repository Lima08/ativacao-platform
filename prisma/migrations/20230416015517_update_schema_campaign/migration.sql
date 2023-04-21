-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `images_campaingId_fkey`;

-- DropForeignKey
ALTER TABLE `videos` DROP FOREIGN KEY `videos_campaingId_fkey`;

-- AlterTable
ALTER TABLE `images` DROP COLUMN `campaingId`,
    ADD COLUMN `campaignId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `videos` DROP COLUMN `campaingId`,
    ADD COLUMN `campaignId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `videos` ADD CONSTRAINT `videos_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

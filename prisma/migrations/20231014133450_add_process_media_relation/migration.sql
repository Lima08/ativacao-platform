-- AlterTable
ALTER TABLE `media` ADD COLUMN `processId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `media` ADD CONSTRAINT `media_processId_fkey` FOREIGN KEY (`processId`) REFERENCES `process`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

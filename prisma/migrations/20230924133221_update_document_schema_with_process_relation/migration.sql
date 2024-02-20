-- AlterTable
ALTER TABLE `document` ADD COLUMN `processId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `document` ADD CONSTRAINT `document_processId_fkey` FOREIGN KEY (`processId`) REFERENCES `process`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

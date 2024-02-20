/*
  Warnings:

  - Added the required column `companyId` to the `template_process` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `template_process` ADD COLUMN `companyId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `template_process` ADD CONSTRAINT `template_process_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

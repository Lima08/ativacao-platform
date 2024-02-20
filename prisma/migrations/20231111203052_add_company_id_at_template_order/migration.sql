/*
  Warnings:

  - Added the required column `companyId` to the `template_order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `template_order` ADD COLUMN `companyId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `template_order` ADD CONSTRAINT `template_order_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

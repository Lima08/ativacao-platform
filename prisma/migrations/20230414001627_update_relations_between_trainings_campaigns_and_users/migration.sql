/*
  Warnings:

  - Added the required column `companyId` to the `campaigns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `trainings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `trainings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `campaigns` ADD COLUMN `companyId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `trainings` ADD COLUMN `companyId` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trainings` ADD CONSTRAINT `trainings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trainings` ADD CONSTRAINT `trainings_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

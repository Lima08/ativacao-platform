-- CreateTable
CREATE TABLE `process` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `templateProcessId` VARCHAR(191) NOT NULL,
    `messagem` VARCHAR(191) NULL,
    `status` ENUM('open', 'pending', 'rejected', 'done') NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `process` ADD CONSTRAINT `process_templateProcessId_fkey` FOREIGN KEY (`templateProcessId`) REFERENCES `template_process`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

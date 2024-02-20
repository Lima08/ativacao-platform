-- AlterTable
ALTER TABLE `analyzes` MODIFY `title` VARCHAR(555) NOT NULL,
    MODIFY `message` VARCHAR(1500) NULL,
    MODIFY `bucketUrl` VARCHAR(555) NULL,
    MODIFY `biUrl` VARCHAR(555) NULL;

-- AlterTable
ALTER TABLE `campaigns` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `description` VARCHAR(555) NULL;

-- AlterTable
ALTER TABLE `companies` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `imageUrl` VARCHAR(555) NULL;

-- AlterTable
ALTER TABLE `document` MODIFY `url` VARCHAR(555) NOT NULL;

-- AlterTable
ALTER TABLE `media` MODIFY `url` VARCHAR(555) NOT NULL;

-- AlterTable
ALTER TABLE `notifications` MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `description` VARCHAR(555) NOT NULL;

-- AlterTable
ALTER TABLE `process` MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `message` VARCHAR(1500) NULL;

-- AlterTable
ALTER TABLE `template_process` MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `bucketUrl` VARCHAR(555) NOT NULL;

-- AlterTable
ALTER TABLE `trainings` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `description` VARCHAR(555) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `imageUrl` VARCHAR(555) NULL;

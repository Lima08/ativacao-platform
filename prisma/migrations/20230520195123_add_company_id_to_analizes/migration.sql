/*
 Warnings:
 - You are about to alter the column `name` on the `campaigns` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(95)`.
 - You are about to alter the column `name` on the `companies` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(95)`.
 - You are about to alter the column `name` on the `trainings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(95)`.
 - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(95)`.
 - Added the required column `companyId` to the `analyzes` table without a default value. This is not possible if the table is not empty.
 */

-- AlterTable

ALTER TABLE `analyzes`
ADD
    COLUMN `companyId` VARCHAR(191) NOT NULL,
ADD
    COLUMN `message` VARCHAR(255) NULL,
    MODIFY `title` VARCHAR(255) NOT NULL;

-- AlterTable

ALTER TABLE `campaigns` MODIFY `name` VARCHAR(95) NOT NULL;

-- AlterTable

ALTER TABLE `companies` MODIFY `name` VARCHAR(95) NOT NULL;

-- AlterTable

ALTER TABLE `trainings` MODIFY `name` VARCHAR(95) NOT NULL;

-- AlterTable

ALTER TABLE `users`
ADD
    COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false,
ADD
    COLUMN `role` INTEGER NOT NULL DEFAULT 100,
    MODIFY `name` VARCHAR(95) NOT NULL;
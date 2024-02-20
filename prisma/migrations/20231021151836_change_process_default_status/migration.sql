-- AlterTable
ALTER TABLE `process` MODIFY `status` ENUM('open', 'pending', 'rejected', 'done') NOT NULL DEFAULT 'open';

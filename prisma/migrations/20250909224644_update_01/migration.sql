/*
  Warnings:

  - You are about to alter the column `status` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Service` MODIFY `status` ENUM('PENDING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'DELIVERED', 'CANCELED') NOT NULL DEFAULT 'PENDING';

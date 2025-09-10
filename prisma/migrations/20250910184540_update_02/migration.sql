/*
  Warnings:

  - You are about to drop the column `name` on the `Client` table. All the data in the column will be lost.
  - Added the required column `fist_name` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Client` DROP COLUMN `name`,
    ADD COLUMN `fist_name` VARCHAR(255) NOT NULL,
    ADD COLUMN `last_name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('ADMIN', 'EMPLOYEE', 'SUPERADMIN') NOT NULL DEFAULT 'EMPLOYEE';

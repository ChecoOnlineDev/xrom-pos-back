/*
  Warnings:

  - You are about to drop the column `completed_name` on the `Client` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Client` DROP COLUMN `completed_name`,
    ADD COLUMN `fullName` VARCHAR(255) NOT NULL;

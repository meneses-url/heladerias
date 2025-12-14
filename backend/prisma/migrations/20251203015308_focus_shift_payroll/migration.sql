/*
  Warnings:

  - You are about to drop the column `ingredientId` on the `PurchaseItem` table. All the data in the column will be lost.
  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryMovement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `InventoryMovement` DROP FOREIGN KEY `InventoryMovement_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryMovement` DROP FOREIGN KEY `InventoryMovement_ingredientId_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryMovement` DROP FOREIGN KEY `InventoryMovement_purchaseItemId_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryMovement` DROP FOREIGN KEY `InventoryMovement_saleItemId_fkey`;

-- DropForeignKey
ALTER TABLE `PurchaseItem` DROP FOREIGN KEY `PurchaseItem_ingredientId_fkey`;

-- DropForeignKey
ALTER TABLE `RecipeItem` DROP FOREIGN KEY `RecipeItem_ingredientId_fkey`;

-- DropForeignKey
ALTER TABLE `RecipeItem` DROP FOREIGN KEY `RecipeItem_variantId_fkey`;

-- DropIndex
DROP INDEX `PurchaseItem_ingredientId_idx` ON `PurchaseItem`;

-- AlterTable
ALTER TABLE `PurchaseItem` DROP COLUMN `ingredientId`,
    ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL DEFAULT 'Item',
    MODIFY `unit` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Sale` ADD COLUMN `couponCode` VARCHAR(191) NULL,
    ADD COLUMN `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `promoDescription` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Shift` ADD COLUMN `createdById` INTEGER NULL;

-- DropTable
DROP TABLE `Ingredient`;

-- DropTable
DROP TABLE `InventoryMovement`;

-- DropTable
DROP TABLE `RecipeItem`;

-- CreateTable
CREATE TABLE `SalesGoal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `target` DECIMAL(12, 2) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

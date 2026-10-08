/*
  Warnings:

  - You are about to drop the column `subCategoryId` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[categoryId,name]` on the table `subcategories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_subCategoryId_fkey`;

-- DropIndex
DROP INDEX `products_subCategoryId_fkey` ON `products`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `subCategoryId`,
    ADD COLUMN `subcategoryId` INTEGER NULL,
    ADD COLUMN `thumbnailPublicId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `products_subcategoryId_idx` ON `products`(`subcategoryId`);

-- CreateIndex
CREATE INDEX `subcategories_categoryId_idx` ON `subcategories`(`categoryId`);

-- CreateIndex
CREATE UNIQUE INDEX `subcategories_categoryId_name_key` ON `subcategories`(`categoryId`, `name`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `subcategories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `products_categoryId_idx` ON `products`(`categoryId`);
DROP INDEX `products_categoryId_fkey` ON `products`;

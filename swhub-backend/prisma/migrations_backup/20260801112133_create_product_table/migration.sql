-- AlterTable
ALTER TABLE `products` ADD COLUMN `ageGroup` VARCHAR(191) NULL,
    ADD COLUMN `brand` VARCHAR(191) NULL,
    MODIFY `description` LONGTEXT NULL,
    MODIFY `price` DECIMAL(10, 2) NOT NULL,
    MODIFY `discountPrice` DECIMAL(10, 2) NULL;

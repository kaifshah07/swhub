-- CreateTable
CREATE TABLE `franchise_enquiries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `ownsBusiness` BOOLEAN NOT NULL DEFAULT false,
    `currentBusinessName` VARCHAR(191) NULL,
    `currentBusinessType` VARCHAR(191) NULL,
    `businessExperience` VARCHAR(191) NULL,
    `preferredLocation` VARCHAR(191) NOT NULL,
    `preferredCity` VARCHAR(191) NOT NULL,
    `preferredArea` VARCHAR(191) NULL,
    `investmentCapacity` VARCHAR(191) NOT NULL,
    `storeType` VARCHAR(191) NOT NULL,
    `startTimeline` VARCHAR(191) NOT NULL,
    `message` TEXT NULL,
    `status` ENUM('NEW', 'CONTACTED', 'IN_PROGRESS', 'CONVERTED', 'REJECTED') NOT NULL DEFAULT 'NEW',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

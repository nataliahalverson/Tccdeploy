-- CreateTable User
CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `name` VARCHAR(191),
  `password` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL
);

-- CreateTable Post
CREATE TABLE `Post` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `content` LONGTEXT NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
);

-- CreateTable PointEvent
CREATE TABLE `PointEvent` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `points` INT NOT NULL,
  `metaHash` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY `PointEvent_userId_type_metaHash_unique` (`userId`, `type`, `metaHash`),
  INDEX `PointEvent_userId_idx` (`userId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
);

-- CreateIndex
CREATE INDEX `Post_userId_idx` ON `Post`(`userId`);
CREATE INDEX `Post_createdAt_idx` ON `Post`(`createdAt`);

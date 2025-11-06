-- Migration: 20251031_add_reservations_payments
-- Description: Adiciona tabelas ReservationRequest e ReservationPayment para controlar solicitações e pagamentos de reservas

-- =====================================================
-- Tabela: ReservationRequest
-- =====================================================
CREATE TABLE IF NOT EXISTS `ReservationRequest` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NULL,
  `destination` VARCHAR(191) NULL,
  `tripStart` DATETIME(3) NULL,
  `tripEnd` DATETIME(3) NULL,
  `tripDuration` VARCHAR(191) NULL,
  `budget` VARCHAR(191) NULL,
  `status` ENUM('PENDING','CONFIRMED','PAID','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `formData` JSON NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  INDEX `ReservationRequest_userId_idx` (`userId`),
  CONSTRAINT `ReservationRequest_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- Tabela: ReservationPayment
-- =====================================================
CREATE TABLE IF NOT EXISTS `ReservationPayment` (
  `id` VARCHAR(191) NOT NULL,
  `reservationId` VARCHAR(191) NOT NULL,
  `method` ENUM('PIX','CREDIT_CARD','BOLETO') NOT NULL,
  `amount` DECIMAL(10,2) NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'BRL',
  `details` JSON NULL,
  `status` ENUM('PENDING','CONFIRMED','FAILED') NOT NULL DEFAULT 'CONFIRMED',
  `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `receiptCode` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `ReservationPayment_receiptCode_key` (`receiptCode`),
  INDEX `ReservationPayment_reservationId_idx` (`reservationId`),
  CONSTRAINT `ReservationPayment_reservationId_fkey`
  FOREIGN KEY (`reservationId`) REFERENCES `ReservationRequest` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- Instruções de Aplicação
-- =====================================================
-- Execute este arquivo no banco MySQL do ambiente (ex.: AlwaysData):
--
-- mysql -h <host> -u <user> -p -D <database> < prisma/migrations/20251031_add_reservations_payments/migration.sql
--
-- Após aplicar, rode `npx prisma generate` para atualizar o client.

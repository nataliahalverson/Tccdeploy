-- Migration: 20251022_add_user_post_points
-- Description: Cria tabelas User, Post e PointEvent para MVP
-- Executed on: AlwaysData (sem shadow DB)

-- =====================================================
-- Tabela: User
-- =====================================================
CREATE TABLE IF NOT EXISTS `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabela: Post
-- =====================================================
CREATE TABLE IF NOT EXISTS `Post` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  INDEX `Post_userId_idx` (`userId`),
  CONSTRAINT `Post_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabela: PointEvent
-- =====================================================
-- Estrutura para eventos de pontos com idempotência
-- UNIQUE constraint em (userId, type, metaHash) previne duplicatas
CREATE TABLE IF NOT EXISTS `PointEvent` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `points` INT NOT NULL,
  `meta` JSON NULL,
  `metaHash` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `PointEvent_userId_type_metaHash_key` (`userId`, `type`, `metaHash`),
  INDEX `PointEvent_userId_idx` (`userId`),
  INDEX `PointEvent_createdAt_idx` (`createdAt`),
  CONSTRAINT `PointEvent_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Instruções de Aplicação
-- =====================================================
-- Execute este arquivo no MySQL do AlwaysData:
--
-- 1. Abra a linha de comando (localmente):
--    mysql -h mysql-facerec.alwaysdata.net -u facerec -p -D facerec_form < prisma/migrations/20251022_add_user_post_points.sql
--
-- 2. Ou no cliente MySQL (phpMyAdmin):
--    - Acesse Importação
--    - Selecione este arquivo
--    - Execute
--
-- 3. Verifique a criação:
--    SHOW TABLES;
--    DESC User;
--    DESC Post;
--    DESC PointEvent;

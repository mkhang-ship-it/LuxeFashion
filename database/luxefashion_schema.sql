-- ============================================================
-- LuxeFashion Database Schema
-- Generated from Laravel migrations
-- Laravel 9 | PHP 8.2+
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';

-- ============================================================
-- Xóa bảng cũ nếu tồn tại (theo thứ tự phụ thuộc)
-- ============================================================
DROP TABLE IF EXISTS `wishlists`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `personal_access_tokens`;
DROP TABLE IF EXISTS `failed_jobs`;
DROP TABLE IF EXISTS `password_resets`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `migrations`;

-- ============================================================
-- Bảng: migrations (Laravel internal)
-- ============================================================
CREATE TABLE `migrations` (
    `id`        INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch`     INT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Bảng: users
-- Migration: 2014_10_12_000000_create_users_table
--          + 2026_04_28_130500_add_phone_to_users_table
--          + 2026_04_30_093500_add_is_admin_to_users_table
-- ============================================================
CREATE TABLE `users` (
    `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name`              VARCHAR(255)    NOT NULL,
    `email`             VARCHAR(255)    NOT NULL,
    `phone`             VARCHAR(20)     DEFAULT NULL,
    `is_admin`          TINYINT(1)      NOT NULL DEFAULT 0,
    `email_verified_at` TIMESTAMP       DEFAULT NULL,
    `password`          VARCHAR(255)    NOT NULL,
    `remember_token`    VARCHAR(100)    DEFAULT NULL,
    `created_at`        TIMESTAMP       DEFAULT NULL,
    `updated_at`        TIMESTAMP       DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Bảng: password_resets
-- Migration: 2014_10_12_100000_create_password_resets_table
-- ============================================================
CREATE TABLE `password_resets` (
    `email`      VARCHAR(255) NOT NULL,
    `token`      VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP    DEFAULT NULL,
    PRIMARY KEY (`email`),
    KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Bảng: failed_jobs
-- Migration: 2019_08_19_000000_create_failed_jobs_table
-- ============================================================
CREATE TABLE `failed_jobs` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid`       VARCHAR(255)    NOT NULL,
    `connection` TEXT            NOT NULL,
    `queue`      TEXT            NOT NULL,
    `payload`    LONGTEXT        NOT NULL,
    `exception`  LONGTEXT        NOT NULL,
    `failed_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Bảng: personal_access_tokens (Sanctum)
-- Migration: 2019_12_14_000001_create_personal_access_tokens_table
-- ============================================================
CREATE TABLE `personal_access_tokens` (
    `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenable_type` VARCHAR(255)    NOT NULL,
    `tokenable_id`   BIGINT UNSIGNED NOT NULL,
    `name`           VARCHAR(255)    NOT NULL,
    `token`          VARCHAR(64)     NOT NULL,
    `abilities`      TEXT            DEFAULT NULL,
    `last_used_at`   TIMESTAMP       DEFAULT NULL,
    `expires_at`     TIMESTAMP       DEFAULT NULL,
    `created_at`     TIMESTAMP       DEFAULT NULL,
    `updated_at`     TIMESTAMP       DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
    KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Bảng: carts
-- Migration: 2026_04_28_130600_create_carts_table
-- ============================================================
CREATE TABLE `carts` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `public_id`  CHAR(36)        NOT NULL,
    `user_id`    BIGINT UNSIGNED DEFAULT NULL,
    `created_at` TIMESTAMP       DEFAULT NULL,
    `updated_at` TIMESTAMP       DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `carts_public_id_unique` (`public_id`),
    KEY `carts_user_id_foreign` (`user_id`),
    CONSTRAINT `carts_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Bảng: cart_items
-- Migration: 2026_04_28_130700_create_cart_items_table
-- ============================================================
CREATE TABLE `cart_items` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `cart_id`    BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `name`       VARCHAR(255)    NOT NULL,
    `price`      DECIMAL(12,2)   NOT NULL,
    `qty`        INT UNSIGNED    NOT NULL,
    `subtotal`   DECIMAL(12,2)   NOT NULL,
    `created_at` TIMESTAMP       DEFAULT NULL,
    `updated_at` TIMESTAMP       DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `cart_items_cart_id_product_id_unique` (`cart_id`, `product_id`),
    KEY `cart_items_cart_id_foreign` (`cart_id`),
    CONSTRAINT `cart_items_cart_id_foreign`
        FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Bảng: orders
-- Migration: 2026_04_28_132000_create_orders_table
-- ============================================================
CREATE TABLE `orders` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_no`   VARCHAR(255)    NOT NULL,
    `user_id`    BIGINT UNSIGNED DEFAULT NULL,
    `subtotal`   DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    `shipping`   DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    `tax`        DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    `discount`   DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    `total`      DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    `status`     VARCHAR(255)    NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP       DEFAULT NULL,
    `updated_at` TIMESTAMP       DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `orders_order_no_unique` (`order_no`),
    KEY `orders_user_id_foreign` (`user_id`),
    CONSTRAINT `orders_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Bảng: order_items
-- Migration: 2026_04_28_132100_create_order_items_table
-- ============================================================
CREATE TABLE `order_items` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id`   BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `name`       VARCHAR(255)    NOT NULL,
    `price`      DECIMAL(12,2)   NOT NULL,
    `qty`        INT UNSIGNED    NOT NULL,
    `subtotal`   DECIMAL(12,2)   NOT NULL,
    `created_at` TIMESTAMP       DEFAULT NULL,
    `updated_at` TIMESTAMP       DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `order_items_order_id_foreign` (`order_id`),
    CONSTRAINT `order_items_order_id_foreign`
        FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Bảng: wishlists
-- Migration: 2026_04_28_140000_create_wishlists_table
-- ============================================================
CREATE TABLE `wishlists` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id`    BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP       DEFAULT NULL,
    `updated_at` TIMESTAMP       DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `wishlists_user_id_product_id_unique` (`user_id`, `product_id`),
    KEY `wishlists_user_id_foreign` (`user_id`),
    CONSTRAINT `wishlists_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Ghi lại migrations đã chạy
-- ============================================================
INSERT INTO `migrations` (`migration`, `batch`) VALUES
('2014_10_12_000000_create_users_table', 1),
('2014_10_12_100000_create_password_resets_table', 1),
('2019_08_19_000000_create_failed_jobs_table', 1),
('2019_12_14_000001_create_personal_access_tokens_table', 1),
('2026_04_28_130500_add_phone_to_users_table', 1),
('2026_04_28_130600_create_carts_table', 1),
('2026_04_28_130700_create_cart_items_table', 1),
('2026_04_28_132000_create_orders_table', 1),
('2026_04_28_132100_create_order_items_table', 1),
('2026_04_28_140000_create_wishlists_table', 1),
('2026_04_30_093500_add_is_admin_to_users_table', 1);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- XONG. Chạy lệnh sau để import:
--   mysql -u root -p luxefashion < luxefashion_schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS contify_php CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE contify_php;

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(120) NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NULL,
    phone VARCHAR(32) NULL,
    job_title VARCHAR(100) NULL,
    department VARCHAR(100) NULL,
    bio VARCHAR(200) NULL,
    timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Kolkata',
    language VARCHAR(16) NOT NULL DEFAULT 'en',
    avatar_url VARCHAR(1024) NULL,
    notification_prefs JSON NULL,
    role ENUM('STAKEHOLDER', 'ADMIN', 'EDITOR') NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

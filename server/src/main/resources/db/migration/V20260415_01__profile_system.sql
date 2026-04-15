ALTER TABLE users
    ADD COLUMN IF NOT EXISTS display_name VARCHAR(120) NULL,
    ADD COLUMN IF NOT EXISTS phone VARCHAR(32) NULL,
    ADD COLUMN IF NOT EXISTS job_title VARCHAR(100) NULL,
    ADD COLUMN IF NOT EXISTS department VARCHAR(100) NULL,
    ADD COLUMN IF NOT EXISTS bio VARCHAR(200) NULL,
    ADD COLUMN IF NOT EXISTS timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Kolkata',
    ADD COLUMN IF NOT EXISTS language VARCHAR(16) NOT NULL DEFAULT 'en',
    ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(1024) NULL,
    ADD COLUMN IF NOT EXISTS notification_prefs JSON NULL;

CREATE TABLE IF NOT EXISTS editor_profiles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    skills JSON NULL,
    content_types JSON NULL,
    portfolio_links JSON NULL,
    max_concurrent_tasks INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_editor_profiles_user_id (user_id),
    CONSTRAINT fk_editor_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS client_company_profiles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    company_name VARCHAR(160) NULL,
    industry VARCHAR(120) NULL,
    website VARCHAR(255) NULL,
    gst_number VARCHAR(15) NULL,
    brand_colors JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_client_company_profiles_user_id (user_id),
    CONSTRAINT fk_client_company_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

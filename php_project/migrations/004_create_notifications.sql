USE contify_php;

CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NULL,
    recipient_email VARCHAR(255) NULL,
    recipient_role ENUM('ADMIN', 'EDITOR', 'STAKEHOLDER') NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    level ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR') NOT NULL DEFAULT 'INFO',
    project_id CHAR(36) NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_project FOREIGN KEY (project_id) REFERENCES project_requests(id) ON DELETE CASCADE,
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_email (recipient_email),
    INDEX idx_notifications_role (recipient_role),
    INDEX idx_notifications_created (created_at)
);

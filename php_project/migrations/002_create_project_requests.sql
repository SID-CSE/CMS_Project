USE contify_php;

CREATE TABLE IF NOT EXISTS project_requests (
    id CHAR(36) PRIMARY KEY,
    client_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    content_types JSON NULL,
    deadline DATE NOT NULL,
    status ENUM('REQUESTED', 'PLAN_SENT', 'IN_PROGRESS', 'DELIVERED', 'REVISION', 'SIGNED_OFF') NOT NULL DEFAULT 'REQUESTED',
    stakeholder_rating INT NULL,
    stakeholder_feedback LONGTEXT NULL,
    stakeholder_reviewed_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_project_requests_client FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_project_requests_client (client_id),
    INDEX idx_project_requests_status (status)
);

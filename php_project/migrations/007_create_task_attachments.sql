USE contify_php;

CREATE TABLE IF NOT EXISTS task_attachments (
    id CHAR(36) PRIMARY KEY,
    task_id CHAR(36) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(1024) NOT NULL,
    mime_type VARCHAR(255) NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_task_attachments_task FOREIGN KEY (task_id) REFERENCES project_tasks(id) ON DELETE CASCADE,
    INDEX idx_task_attachments_task (task_id),
    INDEX idx_task_attachments_created (created_at)
);

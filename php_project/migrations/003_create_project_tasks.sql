USE contify_php;

CREATE TABLE IF NOT EXISTS project_tasks (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    assignee_email VARCHAR(255) NOT NULL,
    status ENUM('ASSIGNED', 'SUBMITTED', 'APPROVED', 'REVISION_REQUESTED') NOT NULL DEFAULT 'ASSIGNED',
    submission_note TEXT NULL,
    admin_review_note TEXT NULL,
    submitted_at DATETIME NULL,
    reviewed_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_project_tasks_project FOREIGN KEY (project_id) REFERENCES project_requests(id) ON DELETE CASCADE,
    INDEX idx_project_tasks_project (project_id),
    INDEX idx_project_tasks_assignee (assignee_email),
    INDEX idx_project_tasks_status (status)
);

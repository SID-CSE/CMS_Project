USE contify_php;

CREATE TABLE IF NOT EXISTS message_threads (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NULL,
    subject VARCHAR(255) NULL,
    participant_a_id CHAR(36) NOT NULL,
    participant_b_id CHAR(36) NOT NULL,
    last_message_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_message_threads_project FOREIGN KEY (project_id) REFERENCES project_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_message_threads_participant_a FOREIGN KEY (participant_a_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_message_threads_participant_b FOREIGN KEY (participant_b_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_message_threads_participant_a (participant_a_id),
    INDEX idx_message_threads_participant_b (participant_b_id),
    INDEX idx_message_threads_updated (updated_at)
);

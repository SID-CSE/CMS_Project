USE contify_php;

CREATE TABLE IF NOT EXISTS messages (
    id CHAR(36) PRIMARY KEY,
    thread_id CHAR(36) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    body TEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_messages_thread FOREIGN KEY (thread_id) REFERENCES message_threads(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_messages_thread_created (thread_id, created_at),
    INDEX idx_messages_sender (sender_id),
    INDEX idx_messages_is_read (is_read)
);

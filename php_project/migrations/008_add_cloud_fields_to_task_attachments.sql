USE contify_php;

ALTER TABLE task_attachments
    ADD COLUMN upload_provider VARCHAR(32) NULL AFTER mime_type,
    ADD COLUMN public_id VARCHAR(255) NULL AFTER upload_provider,
    ADD COLUMN resource_type VARCHAR(32) NULL AFTER public_id,
    ADD COLUMN file_type VARCHAR(32) NULL AFTER resource_type,
    ADD COLUMN stream_url VARCHAR(1024) NULL AFTER file_type;

CREATE INDEX idx_task_attachments_provider ON task_attachments (upload_provider);
CREATE INDEX idx_task_attachments_public_id ON task_attachments (public_id);

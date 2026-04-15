<?php

declare(strict_types=1);

namespace App\Models;

final class TaskAttachment
{
    public function __construct(
        public string $id,
        public string $taskId,
        public string $originalName,
        public string $storedName,
        public string $filePath,
        public ?string $mimeType,
        public string $createdAt
    ) {
    }

    public static function fromArray(array $row): self
    {
        return new self(
            id: (string) $row['id'],
            taskId: (string) $row['task_id'],
            originalName: (string) $row['original_name'],
            storedName: (string) $row['stored_name'],
            filePath: (string) $row['file_path'],
            mimeType: $row['mime_type'] ?? null,
            createdAt: (string) $row['created_at']
        );
    }
}


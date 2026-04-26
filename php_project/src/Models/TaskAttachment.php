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
        public ?string $uploadProvider,
        public ?string $publicId,
        public ?string $resourceType,
        public ?string $fileType,
        public ?string $streamUrl,
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
            uploadProvider: $row['upload_provider'] ?? null,
            publicId: $row['public_id'] ?? null,
            resourceType: $row['resource_type'] ?? null,
            fileType: $row['file_type'] ?? null,
            streamUrl: $row['stream_url'] ?? null,
            createdAt: (string) $row['created_at']
        );
    }
}

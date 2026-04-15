<?php

declare(strict_types=1);

namespace App\Models;

final class Notification
{
    public function __construct(
        public string $id,
        public ?string $userId,
        public ?string $recipientEmail,
        public ?string $recipientRole,
        public string $title,
        public string $body,
        public string $level,
        public ?string $projectId,
        public bool $isRead,
        public string $createdAt,
        public string $updatedAt
    ) {
    }

    public static function fromArray(array $row): self
    {
        return new self(
            id: (string) $row['id'],
            userId: $row['user_id'] ?? null,
            recipientEmail: $row['recipient_email'] ?? null,
            recipientRole: $row['recipient_role'] ?? null,
            title: (string) $row['title'],
            body: (string) $row['body'],
            level: (string) $row['level'],
            projectId: $row['project_id'] ?? null,
            isRead: ((int) ($row['is_read'] ?? 0)) === 1,
            createdAt: (string) $row['created_at'],
            updatedAt: (string) $row['updated_at']
        );
    }
}

<?php

declare(strict_types=1);

namespace App\Models;

final class Message
{
    public function __construct(
        public string $id,
        public string $threadId,
        public string $senderId,
        public string $body,
        public bool $isRead,
        public string $createdAt,
        public string $updatedAt
    ) {
    }

    public static function fromArray(array $row): self
    {
        return new self(
            id: (string) $row['id'],
            threadId: (string) $row['thread_id'],
            senderId: (string) $row['sender_id'],
            body: (string) $row['body'],
            isRead: ((int) ($row['is_read'] ?? 0)) === 1,
            createdAt: (string) $row['created_at'],
            updatedAt: (string) $row['updated_at']
        );
    }
}

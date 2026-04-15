<?php

declare(strict_types=1);

namespace App\Models;

final class MessageThread
{
    public function __construct(
        public string $id,
        public ?string $projectId,
        public ?string $subject,
        public string $participantAId,
        public string $participantBId,
        public string $createdAt,
        public string $updatedAt,
        public ?string $lastMessageAt,
        public ?string $lastMessageBody = null,
        public ?string $lastSenderId = null,
        public int $unreadCount = 0
    ) {
    }

    public static function fromArray(array $row): self
    {
        return new self(
            id: (string) $row['id'],
            projectId: $row['project_id'] ?? null,
            subject: $row['subject'] ?? null,
            participantAId: (string) $row['participant_a_id'],
            participantBId: (string) $row['participant_b_id'],
            createdAt: (string) $row['created_at'],
            updatedAt: (string) $row['updated_at'],
            lastMessageAt: $row['last_message_at'] ?? null,
            lastMessageBody: $row['last_message_body'] ?? null,
            lastSenderId: $row['last_sender_id'] ?? null,
            unreadCount: isset($row['unread_count']) ? (int) $row['unread_count'] : 0
        );
    }
}

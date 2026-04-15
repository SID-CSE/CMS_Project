<?php

declare(strict_types=1);

namespace App\Models;

final class ProjectRequest
{
    public const STATUS_REQUESTED = 'REQUESTED';
    public const STATUS_PLAN_SENT = 'PLAN_SENT';
    public const STATUS_IN_PROGRESS = 'IN_PROGRESS';
    public const STATUS_DELIVERED = 'DELIVERED';
    public const STATUS_REVISION = 'REVISION';
    public const STATUS_SIGNED_OFF = 'SIGNED_OFF';

    public function __construct(
        public string $id,
        public string $clientId,
        public string $title,
        public string $description,
        public array $contentTypes,
        public string $deadline,
        public string $status,
        public ?int $stakeholderRating,
        public ?string $stakeholderFeedback,
        public ?string $stakeholderReviewedAt,
        public string $createdAt,
        public string $updatedAt
    ) {
    }

    public static function fromArray(array $row): self
    {
        return new self(
            id: (string) $row['id'],
            clientId: (string) $row['client_id'],
            title: (string) $row['title'],
            description: (string) $row['description'],
            contentTypes: self::decodeContentTypes($row['content_types'] ?? '[]'),
            deadline: (string) $row['deadline'],
            status: (string) $row['status'],
            stakeholderRating: isset($row['stakeholder_rating']) ? (int) $row['stakeholder_rating'] : null,
            stakeholderFeedback: $row['stakeholder_feedback'] ?? null,
            stakeholderReviewedAt: $row['stakeholder_reviewed_at'] ?? null,
            createdAt: (string) $row['created_at'],
            updatedAt: (string) $row['updated_at']
        );
    }

    private static function decodeContentTypes(string $contentTypes): array
    {
        $decoded = json_decode($contentTypes, true);
        return is_array($decoded) ? $decoded : [];
    }
}

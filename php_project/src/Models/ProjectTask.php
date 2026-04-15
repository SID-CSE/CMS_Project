<?php

declare(strict_types=1);

namespace App\Models;

final class ProjectTask
{
    public const STATUS_ASSIGNED = 'ASSIGNED';
    public const STATUS_SUBMITTED = 'SUBMITTED';
    public const STATUS_APPROVED = 'APPROVED';
    public const STATUS_REVISION_REQUESTED = 'REVISION_REQUESTED';

    public function __construct(
        public string $id,
        public string $projectId,
        public string $title,
        public string $description,
        public string $assigneeEmail,
        public string $status,
        public ?string $submissionNote,
        public ?string $adminReviewNote,
        public ?string $submittedAt,
        public ?string $reviewedAt,
        public string $createdAt,
        public string $updatedAt
    ) {
    }

    public static function fromArray(array $row): self
    {
        return new self(
            id: (string) $row['id'],
            projectId: (string) $row['project_id'],
            title: (string) $row['title'],
            description: (string) $row['description'],
            assigneeEmail: (string) $row['assignee_email'],
            status: (string) $row['status'],
            submissionNote: $row['submission_note'] ?? null,
            adminReviewNote: $row['admin_review_note'] ?? null,
            submittedAt: $row['submitted_at'] ?? null,
            reviewedAt: $row['reviewed_at'] ?? null,
            createdAt: (string) $row['created_at'],
            updatedAt: (string) $row['updated_at']
        );
    }
}

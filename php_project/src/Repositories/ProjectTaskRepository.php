<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;
use App\Models\ProjectTask;
use PDO;

final class ProjectTaskRepository
{
    private const DATETIME_FORMAT = 'Y-m-d H:i:s';
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::instance()->connection();
    }

    public function create(string $projectId, string $title, string $description, string $assigneeEmail): ProjectTask
    {
        $id = $this->uuid();
        $now = date(self::DATETIME_FORMAT);

        $stmt = $this->db->prepare(
            'INSERT INTO project_tasks (
                id, project_id, title, description, assignee_email, status,
                submission_note, admin_review_note, submitted_at, reviewed_at, created_at, updated_at
            ) VALUES (
                :id, :project_id, :title, :description, :assignee_email, :status,
                NULL, NULL, NULL, NULL, :created_at, :updated_at
            )'
        );

        $stmt->execute([
            'id' => $id,
            'project_id' => $projectId,
            'title' => $title,
            'description' => $description,
            'assignee_email' => strtolower($assigneeEmail),
            'status' => ProjectTask::STATUS_ASSIGNED,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->findById($id);
    }

    public function findById(string $taskId): ?ProjectTask
    {
        $stmt = $this->db->prepare('SELECT * FROM project_tasks WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $taskId]);
        $row = $stmt->fetch();

        return $row ? ProjectTask::fromArray($row) : null;
    }

    public function findByProjectId(string $projectId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM project_tasks WHERE project_id = :project_id ORDER BY created_at DESC');
        $stmt->execute(['project_id' => $projectId]);

        $rows = $stmt->fetchAll();
        return array_map(static fn (array $row): ProjectTask => ProjectTask::fromArray($row), $rows ?: []);
    }

    public function findByAssigneeEmail(string $email): array
    {
        $stmt = $this->db->prepare('SELECT * FROM project_tasks WHERE assignee_email = :assignee_email ORDER BY updated_at DESC');
        $stmt->execute(['assignee_email' => strtolower($email)]);

        $rows = $stmt->fetchAll();
        return array_map(static fn (array $row): ProjectTask => ProjectTask::fromArray($row), $rows ?: []);
    }

    public function markSubmitted(string $taskId, string $submissionNote): ?ProjectTask
    {
        $stmt = $this->db->prepare(
            'UPDATE project_tasks
             SET status = :status,
                 submission_note = :submission_note,
                 submitted_at = :submitted_at,
                 updated_at = :updated_at
             WHERE id = :id'
        );

        $now = date(self::DATETIME_FORMAT);
        $stmt->execute([
            'id' => $taskId,
            'status' => ProjectTask::STATUS_SUBMITTED,
            'submission_note' => $submissionNote,
            'submitted_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->findById($taskId);
    }

    public function markApproved(string $taskId, string $reviewNote): ?ProjectTask
    {
        return $this->markReviewed($taskId, ProjectTask::STATUS_APPROVED, $reviewNote);
    }

    public function requestRevision(string $taskId, string $reviewNote): ?ProjectTask
    {
        return $this->markReviewed($taskId, ProjectTask::STATUS_REVISION_REQUESTED, $reviewNote);
    }

    public function countForProjectByStatus(string $projectId, string $status): int
    {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM project_tasks WHERE project_id = :project_id AND status = :status');
        $stmt->execute([
            'project_id' => $projectId,
            'status' => $status,
        ]);

        return (int) $stmt->fetchColumn();
    }

    private function markReviewed(string $taskId, string $status, string $reviewNote): ?ProjectTask
    {
        $stmt = $this->db->prepare(
            'UPDATE project_tasks
             SET status = :status,
                 admin_review_note = :admin_review_note,
                 reviewed_at = :reviewed_at,
                 updated_at = :updated_at
             WHERE id = :id'
        );

        $now = date(self::DATETIME_FORMAT);
        $stmt->execute([
            'id' => $taskId,
            'status' => $status,
            'admin_review_note' => $reviewNote,
            'reviewed_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->findById($taskId);
    }

    private function uuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}


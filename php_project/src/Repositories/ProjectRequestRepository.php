<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;
use App\Models\ProjectRequest;
use PDO;

final class ProjectRequestRepository
{
    private const DATETIME_FORMAT = 'Y-m-d H:i:s';
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::instance()->connection();
    }

    public function create(string $clientId, string $title, string $description, array $contentTypes, string $deadline): ProjectRequest
    {
        $id = $this->uuid();
        $now = date(self::DATETIME_FORMAT);
        $status = ProjectRequest::STATUS_REQUESTED;

        $stmt = $this->db->prepare(
            'INSERT INTO project_requests (
                id, client_id, title, description, content_types, deadline, status,
                stakeholder_rating, stakeholder_feedback, stakeholder_reviewed_at, created_at, updated_at
            ) VALUES (
                :id, :client_id, :title, :description, :content_types, :deadline, :status,
                NULL, NULL, NULL, :created_at, :updated_at
            )'
        );

        $stmt->execute([
            'id' => $id,
            'client_id' => $clientId,
            'title' => $title,
            'description' => $description,
            'content_types' => json_encode(array_values($contentTypes), JSON_UNESCAPED_UNICODE),
            'deadline' => $deadline,
            'status' => $status,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->findById($id);
    }

    public function findById(string $projectId): ?ProjectRequest
    {
        $stmt = $this->db->prepare('SELECT * FROM project_requests WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $projectId]);
        $row = $stmt->fetch();

        return $row ? ProjectRequest::fromArray($row) : null;
    }

    public function findByClientId(string $clientId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM project_requests WHERE client_id = :client_id ORDER BY created_at DESC');
        $stmt->execute(['client_id' => $clientId]);

        $rows = $stmt->fetchAll();
        return array_map(static fn (array $row): ProjectRequest => ProjectRequest::fromArray($row), $rows ?: []);
    }

    public function findRecent(int $limit = 5): array
    {
        $stmt = $this->db->prepare('SELECT * FROM project_requests ORDER BY created_at DESC LIMIT :limit');
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        $rows = $stmt->fetchAll();
        return array_map(static fn (array $row): ProjectRequest => ProjectRequest::fromArray($row), $rows ?: []);
    }

    public function findAll(): array
    {
        $stmt = $this->db->query('SELECT * FROM project_requests ORDER BY created_at DESC');
        $rows = $stmt ? $stmt->fetchAll() : [];

        return array_map(static fn (array $row): ProjectRequest => ProjectRequest::fromArray($row), $rows ?: []);
    }

    public function countAll(): int
    {
        return (int) $this->db->query('SELECT COUNT(*) FROM project_requests')->fetchColumn();
    }

    public function countByStatus(string $status): int
    {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM project_requests WHERE status = :status');
        $stmt->execute(['status' => $status]);

        return (int) $stmt->fetchColumn();
    }

    public function updateStatus(string $projectId, string $status): ?ProjectRequest
    {
        $stmt = $this->db->prepare('UPDATE project_requests SET status = :status, updated_at = :updated_at WHERE id = :id');
        $stmt->execute([
            'status' => $status,
            'updated_at' => date(self::DATETIME_FORMAT),
            'id' => $projectId,
        ]);

        return $this->findById($projectId);
    }

    public function requestChanges(string $projectId, string $feedback): ?ProjectRequest
    {
        $stmt = $this->db->prepare(
            'UPDATE project_requests
             SET stakeholder_feedback = :feedback, updated_at = :updated_at
             WHERE id = :id'
        );

        $stmt->execute([
            'feedback' => $feedback,
            'updated_at' => date(self::DATETIME_FORMAT),
            'id' => $projectId,
        ]);

        return $this->findById($projectId);
    }

    public function markStakeholderSignOff(string $projectId, ?int $rating, string $feedback): ?ProjectRequest
    {
        $stmt = $this->db->prepare(
            'UPDATE project_requests
             SET status = :status,
                 stakeholder_rating = :stakeholder_rating,
                 stakeholder_feedback = :stakeholder_feedback,
                 stakeholder_reviewed_at = :stakeholder_reviewed_at,
                 updated_at = :updated_at
             WHERE id = :id'
        );

        $now = date(self::DATETIME_FORMAT);
        $stmt->bindValue(':status', ProjectRequest::STATUS_SIGNED_OFF);
        if ($rating === null) {
            $stmt->bindValue(':stakeholder_rating', null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(':stakeholder_rating', $rating, PDO::PARAM_INT);
        }
        $stmt->bindValue(':stakeholder_feedback', $feedback === '' ? null : $feedback, $feedback === '' ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindValue(':stakeholder_reviewed_at', $now);
        $stmt->bindValue(':updated_at', $now);
        $stmt->bindValue(':id', $projectId);
        $stmt->execute();

        return $this->findById($projectId);
    }

    private function uuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}

<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;
use App\Models\TaskAttachment;
use PDO;

final class TaskAttachmentRepository
{
    private const DATETIME_FORMAT = 'Y-m-d H:i:s';
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::instance()->connection();
    }

    public function create(string $taskId, string $originalName, string $storedName, string $filePath, ?string $mimeType): TaskAttachment
    {
        $id = $this->uuid();
        $now = date(self::DATETIME_FORMAT);

        $stmt = $this->db->prepare(
            'INSERT INTO task_attachments (id, task_id, original_name, stored_name, file_path, mime_type, created_at)
             VALUES (:id, :task_id, :original_name, :stored_name, :file_path, :mime_type, :created_at)'
        );
        $stmt->execute([
            'id' => $id,
            'task_id' => $taskId,
            'original_name' => $originalName,
            'stored_name' => $storedName,
            'file_path' => $filePath,
            'mime_type' => $mimeType,
            'created_at' => $now,
        ]);

        return $this->findById($id);
    }

    public function findById(string $id): ?TaskAttachment
    {
        $stmt = $this->db->prepare('SELECT * FROM task_attachments WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        return $row ? TaskAttachment::fromArray($row) : null;
    }

    public function findByTaskId(string $taskId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM task_attachments WHERE task_id = :task_id ORDER BY created_at DESC');
        $stmt->execute(['task_id' => $taskId]);
        $rows = $stmt->fetchAll();

        return array_map(static fn (array $row): TaskAttachment => TaskAttachment::fromArray($row), $rows ?: []);
    }

    private function uuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}

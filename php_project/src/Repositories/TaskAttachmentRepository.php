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
    /** @var array<string,bool>|null */
    private ?array $availableColumns = null;

    public function __construct()
    {
        $this->db = Database::instance()->connection();
    }

    public function create(
        string $taskId,
        string $originalName,
        string $storedName,
        string $filePath,
        ?string $mimeType,
        ?string $uploadProvider = null,
        ?string $publicId = null,
        ?string $resourceType = null,
        ?string $fileType = null,
        ?string $streamUrl = null
    ): TaskAttachment
    {
        $id = $this->uuid();
        $now = date(self::DATETIME_FORMAT);

        $values = [
            'id' => $id,
            'task_id' => $taskId,
            'original_name' => $originalName,
            'stored_name' => $storedName,
            'file_path' => $filePath,
            'mime_type' => $mimeType,
            'upload_provider' => $uploadProvider,
            'public_id' => $publicId,
            'resource_type' => $resourceType,
            'file_type' => $fileType,
            'stream_url' => $streamUrl,
            'created_at' => $now,
        ];
        $values = $this->filterToExistingColumns($values);

        $columns = array_keys($values);
        $placeholders = array_map(static fn (string $column): string => ':' . $column, $columns);

        $stmt = $this->db->prepare(
            'INSERT INTO task_attachments (' . implode(', ', $columns) . ')
             VALUES (' . implode(', ', $placeholders) . ')'
        );
        $stmt->execute($values);

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

    /**
     * @param array<string,mixed> $values
     * @return array<string,mixed>
     */
    private function filterToExistingColumns(array $values): array
    {
        $available = $this->getAvailableColumns();

        return array_filter(
            $values,
            static fn (mixed $value, string $column): bool => isset($available[$column]),
            ARRAY_FILTER_USE_BOTH
        );
    }

    /**
     * @return array<string,bool>
     */
    private function getAvailableColumns(): array
    {
        if ($this->availableColumns !== null) {
            return $this->availableColumns;
        }

        $stmt = $this->db->query('SHOW COLUMNS FROM task_attachments');
        $rows = $stmt ? $stmt->fetchAll() : [];

        $columns = [];
        foreach ($rows ?: [] as $row) {
            $field = (string) ($row['Field'] ?? '');
            if ($field !== '') {
                $columns[$field] = true;
            }
        }

        $this->availableColumns = $columns;

        return $this->availableColumns;
    }
}

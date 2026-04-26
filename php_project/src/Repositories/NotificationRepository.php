<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;
use App\Models\Notification;
use PDO;

final class NotificationRepository
{
    private const DATETIME_FORMAT = 'Y-m-d H:i:s';
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::instance()->connection();
    }

    public function create(
        ?string $userId,
        ?string $recipientEmail,
        ?string $recipientRole,
        string $title,
        string $body,
        string $level = 'INFO',
        ?string $projectId = null
    ): Notification {
        $id = $this->uuid();
        $now = date(self::DATETIME_FORMAT);

        $stmt = $this->db->prepare(
            'INSERT INTO notifications (
                id, user_id, recipient_email, recipient_role, title, body, level, project_id,
                is_read, created_at, updated_at
            ) VALUES (
                :id, :user_id, :recipient_email, :recipient_role, :title, :body, :level, :project_id,
                0, :created_at, :updated_at
            )'
        );

        $stmt->execute([
            'id' => $id,
            'user_id' => $userId,
            'recipient_email' => $recipientEmail,
            'recipient_role' => $recipientRole,
            'title' => $title,
            'body' => $body,
            'level' => strtoupper($level),
            'project_id' => $projectId,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->findById($id);
    }

    public function findById(string $id): ?Notification
    {
        $stmt = $this->db->prepare('SELECT * FROM notifications WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        return $row ? Notification::fromArray($row) : null;
    }

    public function findForUser(string $userId, string $email, string $role, int $limit = 30): array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM notifications
             WHERE user_id = :user_id
                OR recipient_email = :recipient_email
                OR recipient_role = :recipient_role
             ORDER BY created_at DESC
             LIMIT ' . (int) $limit
        );

        $stmt->bindValue(':user_id', $userId);
        $stmt->bindValue(':recipient_email', strtolower($email));
        $stmt->bindValue(':recipient_role', strtoupper($role));
        $stmt->execute();

        $rows = $stmt->fetchAll();
        return array_map(static fn (array $row): Notification => Notification::fromArray($row), $rows ?: []);
    }

    public function markRead(string $id): void
    {
        $stmt = $this->db->prepare('UPDATE notifications SET is_read = 1, updated_at = :updated_at WHERE id = :id');
        $stmt->execute([
            'id' => $id,
            'updated_at' => date(self::DATETIME_FORMAT),
        ]);
    }

    public function markReadForRecipient(string $id, string $userId, string $email, string $role): void
    {
        $stmt = $this->db->prepare(
            'UPDATE notifications
             SET is_read = 1, updated_at = :updated_at
             WHERE id = :id
               AND (
                    user_id = :user_id
                    OR recipient_email = :recipient_email
                    OR recipient_role = :recipient_role
               )'
        );

        $stmt->execute([
            'id' => $id,
            'user_id' => $userId,
            'recipient_email' => strtolower($email),
            'recipient_role' => strtoupper($role),
            'updated_at' => date(self::DATETIME_FORMAT),
        ]);
    }

    public function countUnreadForUser(string $userId, string $email, string $role): int
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(*)
             FROM notifications
             WHERE is_read = 0
               AND (
                    user_id = :user_id
                    OR recipient_email = :recipient_email
                    OR recipient_role = :recipient_role
               )'
        );

        $stmt->execute([
            'user_id' => $userId,
            'recipient_email' => strtolower($email),
            'recipient_role' => strtoupper($role),
        ]);

        return (int) $stmt->fetchColumn();
    }

    public function markAllReadForUser(string $userId, string $email, string $role): void
    {
        $stmt = $this->db->prepare(
            'UPDATE notifications
             SET is_read = 1, updated_at = :updated_at
             WHERE is_read = 0
               AND (
                    user_id = :user_id
                    OR recipient_email = :recipient_email
                    OR recipient_role = :recipient_role
               )'
        );

        $stmt->execute([
            'user_id' => $userId,
            'recipient_email' => strtolower($email),
            'recipient_role' => strtoupper($role),
            'updated_at' => date(self::DATETIME_FORMAT),
        ]);
    }

    private function uuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}

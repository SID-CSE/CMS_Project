<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;
use App\Models\Message;
use App\Models\MessageThread;
use App\Models\User;
use PDO;

final class MessageRepository
{
    private const DATETIME_FORMAT = 'Y-m-d H:i:s';
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::instance()->connection();
    }

    public function createThread(string $participantAId, string $participantBId, ?string $subject = null, ?string $projectId = null): MessageThread
    {
        $existing = $this->findThreadByParticipants($participantAId, $participantBId, $projectId, $subject);
        if ($existing !== null) {
            return $existing;
        }

        $id = $this->uuid();
        $now = date(self::DATETIME_FORMAT);

        $stmt = $this->db->prepare(
            'INSERT INTO message_threads (id, project_id, subject, participant_a_id, participant_b_id, last_message_at, created_at, updated_at)
             VALUES (:id, :project_id, :subject, :participant_a_id, :participant_b_id, NULL, :created_at, :updated_at)'
        );
        $stmt->execute([
            'id' => $id,
            'project_id' => $projectId,
            'subject' => $subject,
            'participant_a_id' => $participantAId,
            'participant_b_id' => $participantBId,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->findThreadById($id);
    }

    public function sendMessage(string $threadId, string $senderId, string $body): Message
    {
        $id = $this->uuid();
        $now = date(self::DATETIME_FORMAT);
        $stmt = $this->db->prepare(
            'INSERT INTO messages (id, thread_id, sender_id, body, is_read, created_at, updated_at)
             VALUES (:id, :thread_id, :sender_id, :body, 0, :created_at, :updated_at)'
        );
        $stmt->execute([
            'id' => $id,
            'thread_id' => $threadId,
            'sender_id' => $senderId,
            'body' => $body,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $this->db->prepare('UPDATE message_threads SET last_message_at = :last_message_at, updated_at = :updated_at WHERE id = :id')
            ->execute(['id' => $threadId, 'last_message_at' => $now, 'updated_at' => $now]);

        return $this->findMessageById($id);
    }

    public function findThreadsForUser(string $userId, int $limit = 20): array
    {
        $stmt = $this->db->prepare(
            'SELECT *
             FROM message_threads
             WHERE participant_a_id = :user_id OR participant_b_id = :user_id
             ORDER BY COALESCE(last_message_at, updated_at) DESC
             LIMIT :limit'
        );
        $stmt->bindValue(':user_id', $userId);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        $rows = $stmt->fetchAll();
        $threads = array_map(static fn (array $row): MessageThread => MessageThread::fromArray($row), $rows ?: []);

        foreach ($threads as $thread) {
            $thread->lastMessageBody = $this->findLastMessageBody($thread->id);
            $thread->unreadCount = $this->countUnreadForThreadForUser($thread->id, $userId);
        }

        return $threads;
    }

    public function findThreadById(string $threadId): ?MessageThread
    {
        $stmt = $this->db->prepare('SELECT * FROM message_threads WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $threadId]);
        $row = $stmt->fetch();

        if (!$row) {
            return null;
        }

        $thread = MessageThread::fromArray($row);
        $thread->lastMessageBody = $this->findLastMessageBody($threadId);
        $thread->unreadCount = $this->countUnreadForThread($threadId);

        return $thread;
    }

    public function findMessagesForThread(string $threadId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM messages WHERE thread_id = :thread_id ORDER BY created_at ASC');
        $stmt->execute(['thread_id' => $threadId]);
        $rows = $stmt->fetchAll();

        return array_map(static fn (array $row): Message => Message::fromArray($row), $rows ?: []);
    }

    public function findThreadByParticipants(string $participantAId, string $participantBId, ?string $projectId = null, ?string $subject = null): ?MessageThread
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM message_threads
             WHERE ((participant_a_id = :a AND participant_b_id = :b) OR (participant_a_id = :b AND participant_b_id = :a))
               AND ((:project_id IS NULL AND project_id IS NULL) OR project_id = :project_id)
               AND ((:subject IS NULL AND subject IS NULL) OR subject = :subject)
             LIMIT 1'
        );
        $stmt->bindValue(':a', $participantAId);
        $stmt->bindValue(':b', $participantBId);
        $stmt->bindValue(':project_id', $projectId);
        $stmt->bindValue(':subject', $subject);
        $stmt->execute();
        $row = $stmt->fetch();

        return $row ? MessageThread::fromArray($row) : null;
    }

    public function markThreadRead(string $threadId, string $userId): void
    {
        $stmt = $this->db->prepare(
            'UPDATE messages
             SET is_read = 1, updated_at = :updated_at
             WHERE thread_id = :thread_id AND sender_id <> :user_id'
        );
        $stmt->execute([
            'thread_id' => $threadId,
            'user_id' => $userId,
            'updated_at' => date(self::DATETIME_FORMAT),
        ]);
    }

    public function getUserContacts(string $userId): array
    {
        $stmt = $this->db->prepare(
            'SELECT DISTINCT
                u.id,
                u.email,
                u.name,
                u.role
             FROM users u
             INNER JOIN message_threads t ON (t.participant_a_id = u.id OR t.participant_b_id = u.id)
             WHERE (t.participant_a_id = :user_id OR t.participant_b_id = :user_id)
               AND u.id <> :user_id
             ORDER BY u.name ASC'
        );
        $stmt->execute(['user_id' => $userId]);
        $rows = $stmt->fetchAll();

        return $rows ?: [];
    }

    public function countUnreadThreadsForUser(string $userId): int
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(DISTINCT t.id)
             FROM message_threads t
             INNER JOIN messages m ON m.thread_id = t.id
             WHERE (t.participant_a_id = :user_id OR t.participant_b_id = :user_id)
               AND m.is_read = 0
               AND m.sender_id <> :user_id'
        );
        $stmt->execute(['user_id' => $userId]);

        return (int) $stmt->fetchColumn();
    }

    private function countUnreadForThread(string $threadId): int
    {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM messages WHERE thread_id = :thread_id AND is_read = 0');
        $stmt->execute(['thread_id' => $threadId]);

        return (int) $stmt->fetchColumn();
    }

    private function countUnreadForThreadForUser(string $threadId, string $userId): int
    {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM messages WHERE thread_id = :thread_id AND is_read = 0 AND sender_id <> :user_id');
        $stmt->execute([
            'thread_id' => $threadId,
            'user_id' => $userId,
        ]);

        return (int) $stmt->fetchColumn();
    }

    private function findLastMessageBody(string $threadId): ?string
    {
        $stmt = $this->db->prepare('SELECT body FROM messages WHERE thread_id = :thread_id ORDER BY created_at DESC LIMIT 1');
        $stmt->execute(['thread_id' => $threadId]);
        $body = $stmt->fetchColumn();

        return $body !== false ? (string) $body : null;
    }

    private function findMessageById(string $messageId): ?Message
    {
        $stmt = $this->db->prepare('SELECT * FROM messages WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $messageId]);
        $row = $stmt->fetch();

        return $row ? Message::fromArray($row) : null;
    }

    private function uuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}

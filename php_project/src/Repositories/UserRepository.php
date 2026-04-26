<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;
use App\Models\User;
use PDO;

final class UserRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::instance()->connection();
    }

    public function findByEmail(string $email): ?User
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $row = $stmt->fetch();

        return $row ? User::fromArray($row) : null;
    }

    public function findById(string $id): ?User
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        return $row ? User::fromArray($row) : null;
    }

    /**
     * @return array<int, User>
     */
    public function findAll(): array
    {
        $stmt = $this->db->query('SELECT * FROM users ORDER BY created_at DESC');
        $rows = $stmt ? $stmt->fetchAll() : [];

        return array_map(static fn (array $row): User => User::fromArray($row), $rows ?: []);
    }

    public function findFirstByRole(string $role): ?User
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE role = :role ORDER BY created_at ASC LIMIT 1');
        $stmt->execute(['role' => strtoupper($role)]);
        $row = $stmt->fetch();

        return $row ? User::fromArray($row) : null;
    }

    /**
     * @return array<int, User>
     */
    public function findByRole(string $role): array
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE role = :role AND COALESCE(is_active, 1) = 1 ORDER BY name ASC, email ASC');
        $stmt->execute(['role' => strtoupper($role)]);
        $rows = $stmt->fetchAll();

        return array_map(static fn (array $row): User => User::fromArray($row), $rows ?: []);
    }

    public function create(string $email, string $name, string $role, string $passwordHash): User
    {
        $id = $this->uuid();
        $now = date('Y-m-d H:i:s');

        $stmt = $this->db->prepare(
            'INSERT INTO users (id, email, username, name, display_name, role, password_hash, is_active, timezone, language, created_at, updated_at)
             VALUES (:id, :email, NULL, :name, :display_name, :role, :password_hash, 1, :timezone, :language, :created_at, :updated_at)'
        );

        $stmt->execute([
            'id' => $id,
            'email' => $email,
            'name' => $name,
            'display_name' => $name,
            'role' => strtoupper($role),
            'password_hash' => $passwordHash,
            'timezone' => 'Asia/Kolkata',
            'language' => 'en',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->findById($id);
    }

    private function uuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}

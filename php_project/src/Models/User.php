<?php

declare(strict_types=1);

namespace App\Models;

final class User
{
    public const ROLE_STAKEHOLDER = 'STAKEHOLDER';
    public const ROLE_ADMIN = 'ADMIN';
    public const ROLE_EDITOR = 'EDITOR';

    public function __construct(
        public string $id,
        public string $email,
        public ?string $username,
        public string $name,
        public ?string $displayName,
        public ?string $phone,
        public ?string $jobTitle,
        public ?string $department,
        public ?string $bio,
        public string $timezone,
        public string $language,
        public ?string $avatarUrl,
        public ?string $notificationPrefs,
        public string $role,
        public string $passwordHash,
        public bool $isActive,
        public string $createdAt,
        public string $updatedAt
    ) {
    }

    public static function fromArray(array $row): self
    {
        return new self(
            id: (string) $row['id'],
            email: (string) $row['email'],
            username: $row['username'] ?? null,
            name: (string) $row['name'],
            displayName: $row['display_name'] ?? null,
            phone: $row['phone'] ?? null,
            jobTitle: $row['job_title'] ?? null,
            department: $row['department'] ?? null,
            bio: $row['bio'] ?? null,
            timezone: (string) ($row['timezone'] ?? 'Asia/Kolkata'),
            language: (string) ($row['language'] ?? 'en'),
            avatarUrl: $row['avatar_url'] ?? null,
            notificationPrefs: $row['notification_prefs'] ?? null,
            role: (string) $row['role'],
            passwordHash: (string) $row['password_hash'],
            isActive: (bool) ($row['is_active'] ?? true),
            createdAt: (string) $row['created_at'],
            updatedAt: (string) $row['updated_at']
        );
    }
}


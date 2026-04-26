<?php

declare(strict_types=1);

namespace App\Core;

final class Env
{
    public static function load(string $filePath): void
    {
        if (!is_file($filePath) || !is_readable($filePath)) {
            return;
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        if ($lines === false) {
            return;
        }

        foreach ($lines as $line) {
            $entry = self::parseLine($line);
            if ($entry === null) {
                continue;
            }

            [$key, $value] = $entry;

            if (getenv($key) === false) {
                self::setValue($key, $value);
            }
        }
    }

    /**
     * @return array{string, string}|null
     */
    private static function parseLine(string $line): ?array
    {
        $trimmed = trim($line);

        if ($trimmed === '' || str_starts_with($trimmed, '#')) {
            return null;
        }

        $parts = explode('=', $trimmed, 2);
        if (count($parts) !== 2) {
            return null;
        }

        $key = trim($parts[0]);
        if ($key === '') {
            return null;
        }

        return [$key, self::normalizeValue(trim($parts[1]))];
    }

    private static function normalizeValue(string $value): string
    {
        if ((str_starts_with($value, '"') && str_ends_with($value, '"'))
            || (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
            return substr($value, 1, -1);
        }

        return $value;
    }

    private static function setValue(string $key, string $value): void
    {
        putenv($key . '=' . $value);
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

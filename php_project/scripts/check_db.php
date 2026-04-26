<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/Core/Env.php';

use App\Core\Env;

Env::load(__DIR__ . '/../.env');

$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '3306';
$database = getenv('DB_NAME') ?: 'contify_php';
$user = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASS') ?: '';

if ($password === '' || $password === 'CHANGE_ME') {
    fwrite(STDERR, "DB FAIL: DB_PASS is empty or still set to CHANGE_ME in .env" . PHP_EOL);
    exit(1);
}

try {
    $serverDsn = sprintf('mysql:host=%s;port=%s;charset=utf8mb4', $host, $port);
    $serverPdo = new PDO($serverDsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $dbQuery = $serverPdo->prepare('SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = :db');
    $dbQuery->execute(['db' => $database]);
    $dbExists = (bool) $dbQuery->fetchColumn();

    if (!$dbExists) {
        fwrite(STDERR, sprintf("DB FAIL: Database '%s' does not exist." . PHP_EOL, $database));
        exit(1);
    }

    $appDsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $database);
    new PDO($appDsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    fwrite(STDOUT, sprintf('DB OK: user=%s host=%s port=%s db=%s' . PHP_EOL, $user, $host, $port, $database));
    exit(0);
} catch (\PDOException $exception) {
    fwrite(STDERR, 'DB FAIL: ' . $exception->getMessage() . PHP_EOL);
    exit(1);
}

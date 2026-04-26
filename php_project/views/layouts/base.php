<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= htmlspecialchars($title ?? 'Contify PHP', ENT_QUOTES, 'UTF-8') ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
<?php if (is_array($user ?? null) && !empty($user['role'])): ?>
<?php require_once __DIR__ . '/../partials/role-topbar.php'; ?>
<?php endif; ?>
<?php require_once $viewPath; ?>
</body>
</html>

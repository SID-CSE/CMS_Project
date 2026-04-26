<?php

declare(strict_types=1);

return [
    'name' => 'Contify PHP',
    'base_url' => getenv('APP_URL') ?: 'http://localhost:8000',
    'session_name' => 'contify_php_session',
    'cloudinary' => [
        'cloud_name' => getenv('CLOUDINARY_CLOUD_NAME') ?: '',
        'upload_preset' => getenv('CLOUDINARY_UPLOAD_PRESET') ?: '',
    ],
];

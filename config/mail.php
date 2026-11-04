<?php

return [
    'default' => env('MAIL_MAILER', 'smtp'),

    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'scheme' => env('MAIL_SCHEME'),
            'url' => env('MAIL_URL'),
            'host' => env('MAIL_HOST', '127.0.0.1'),
            'port' => (int) env('MAIL_PORT', 1025),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
            'local_domain' => env('MAIL_EHLO_DOMAIN', parse_url((string) env('APP_URL', 'http://127.0.0.1'), PHP_URL_HOST)),
        ],
    ],

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'firmledger@northline.example'),
        'name' => env('MAIL_FROM_NAME', 'FirmLedger'),
    ],
];

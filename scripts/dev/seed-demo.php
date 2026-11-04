<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

require dirname(__DIR__, 2).'/vendor/autoload.php';

$app = require dirname(__DIR__, 2).'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

if (array_key_exists('firmledger:demo-seed', Artisan::all())) {
    exit(Artisan::call('firmledger:demo-seed'));
}

// Task 13 replaces this compatibility seed with the complete additive demo loader.
// Keeping this small seed here makes a task-1 checkout usable and gives later tasks
// the five documented identities from the first local launch.
if (! Schema::hasTable('users')) {
    Schema::create('users', function ($table): void {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->string('password');
        $table->string('role');
        $table->timestamps();
    });
}

$credentialsFile = dirname(__DIR__, 2).'/demo-credentials.txt';
$accounts = [
    ['Finance preparer', 'preparer@northline.example', 'finance_preparer'],
    ['Finance manager', 'manager@northline.example', 'finance_manager'],
    ['Finance director', 'director@northline.example', 'finance_director'],
    ['Auditor', 'auditor@northline.example', 'auditor'],
    ['System administrator', 'admin@northline.example', 'system_administrator'],
];

// An existing users table belongs to a database that has already been prepared.
// Do not add or replace identities when later feature work or a tester has changed it.
if (DB::table('users')->exists()) {
    echo "Existing demo identities left unchanged.".PHP_EOL;
    exit(0);
}

if (is_file($credentialsFile)) {
    $credentials = file_get_contents($credentialsFile);
    if (! preg_match('/^Password: (.+)$/m', $credentials, $match)) {
        fwrite(STDERR, "Unable to read the password from {$credentialsFile}.".PHP_EOL);
        exit(1);
    }
    $password = trim($match[1]);
} else {
    $password = 'Northline-'.bin2hex(random_bytes(8));
    $lines = ["Northline Advisory local demo credentials", "Password: {$password}"];

    foreach ($accounts as [$name, $email]) {
        $lines[] = "{$name}: {$email}";
    }

    file_put_contents($credentialsFile, implode(PHP_EOL, $lines).PHP_EOL, LOCK_EX);
    echo "Demo sign-in credentials written to {$credentialsFile}".PHP_EOL;
}

$columns = array_flip(Schema::getColumnListing('users'));
foreach ($accounts as [$name, $email, $role]) {
    if (DB::table('users')->where('email', $email)->exists()) {
        continue;
    }

    $values = array_intersect_key([
        'name' => $name,
        'email' => $email,
        'password' => Hash::make($password),
        'role' => $role,
        'created_at' => now(),
        'updated_at' => now(),
    ], $columns);
    DB::table('users')->insert($values);
}

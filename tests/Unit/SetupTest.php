<?php

namespace Tests\Unit;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Http\Request;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

final class SetupTest extends TestCase
{
    #[Test]
    public function application_bootstraps_with_sqlite_and_modular_routes(): void
    {
        $_ENV['MAIL_HOST'] = $_SERVER['MAIL_HOST'] = '127.0.0.1';
        $_ENV['MAIL_PORT'] = $_SERVER['MAIL_PORT'] = '1026';

        $launcher = file_get_contents(dirname(__DIR__, 2).'/scripts/dev/start.mjs');

        $app = require dirname(__DIR__, 2).'/bootstrap/app.php';
        $app->make(Kernel::class)->bootstrap();

        self::assertSame('sqlite', $app->make('config')->get('database.default'));
        self::assertSame('smtp', $app->make('config')->get('mail.default'));
        self::assertSame('smtp', $app->make('config')->get('mail.mailers.smtp.transport'));
        self::assertSame('127.0.0.1', $app->make('config')->get('mail.mailers.smtp.host'));
        self::assertSame(1026, $app->make('config')->get('mail.mailers.smtp.port'));
        $composer = json_decode(file_get_contents(dirname(__DIR__, 2).'/composer.json'), true, flags: JSON_THROW_ON_ERROR);
        self::assertSame('^8.4', $composer['require']['php']);
        self::assertFalse($composer['config']['platform-check']);
        $homeRoute = $app->make('router')->getRoutes()->match(Request::create('/', 'GET'));
        self::assertSame('{path?}', $homeRoute->uri());
        self::assertStringContainsString('ViewController', $homeRoute->getActionName());
        self::assertFileExists(dirname(__DIR__, 2).'/routes/api.php');
        self::assertDirectoryExists(dirname(__DIR__, 2).'/resources/js/components/shared');
        $router = file_get_contents(dirname(__DIR__, 2).'/resources/js/router/index.ts');
        self::assertStringContainsString("import.meta.glob<RouteModule>('./routes/**/*.ts', { eager: true })", $router);
        self::assertStringContainsString('...featureRoutes', $router);
        self::assertStringContainsString('const composerScript = resolveComposerScript()', $launcher);
        self::assertStringContainsString("installWhenLockChanges('composer.lock'", $launcher);
        self::assertStringContainsString("installWhenLockChanges('package-lock.json'", $launcher);
        self::assertStringContainsString("/\\.(?:bat|cmd)$/i.test(command)", $launcher);
        self::assertSame(2, substr_count($launcher, 'shell: needsShell(command)'));
        self::assertStringContainsString("resolve('storage/framework/views')", $launcher);
        self::assertStringContainsString('for (const directory of runtimeDirectories) mkdirSync(directory, { recursive: true })', $launcher);
        self::assertLessThan(strpos($launcher, "artisan(['migrate', '--force'])"), strpos($launcher, 'const runtimeDirectories'));
        self::assertLessThan(strpos($launcher, "artisan(['migrate', '--force'])"), strpos($launcher, 'run(php, [composerScript'));
        self::assertLessThan(strpos($launcher, "artisan(['migrate', '--force'])"), strpos($launcher, 'run(npm'));
        self::assertStringContainsString("run(php, ['scripts/dev/seed-demo.php'], environment)", $launcher);
        self::assertStringContainsString("!(await available(port)) || !(await available(vitePort))", $launcher);
        self::assertStringContainsString("VITE_PORT: String(vitePort)", $launcher);
        self::assertStringContainsString('environment.VITE_HOT_FILE = resolve(`storage/framework/vite-${port}.hot`)', $launcher);
        self::assertStringContainsString('unlinkSync(environment.VITE_HOT_FILE)', $launcher);
        self::assertStringContainsString("['run', 'vite', '--', '--port', String(vitePort)]", $launcher);
        self::assertStringContainsString("if (!existsSync('.env')) copyFileSync('.env.example', '.env')", $launcher);
        self::assertStringContainsString("run(php, ['artisan', 'key:generate', '--force'], environment)", $launcher);
        self::assertStringContainsString("resolvePort(process.env.MAILPIT_SMTP_PORT, 1025, 'MAILPIT_SMTP_PORT')", $launcher);
        self::assertStringContainsString('MAIL_HOST: host', $launcher);
        self::assertStringContainsString('MAIL_PORT: String(mailpitSmtpPort)', $launcher);
        $mailEnvironment = strpos($launcher, 'MAIL_PORT: String(mailpitSmtpPort)');
        self::assertLessThan(strpos($launcher, "run(php, ['artisan', 'key:generate', '--force'], environment)"), $mailEnvironment);
        self::assertLessThan(strpos($launcher, "artisan(['migrate', '--force'])"), $mailEnvironment);
        self::assertLessThan(strpos($launcher, "run(php, ['scripts/dev/seed-demo.php'], environment)"), $mailEnvironment);
        self::assertLessThan(strpos($launcher, "start(php, ['artisan', 'serve'"), $mailEnvironment);
        self::assertLessThan(strpos($launcher, "run(php, ['artisan', 'key:generate'"), strpos($launcher, 'const mailpitSmtpPort'));
        self::assertLessThan(strpos($launcher, "artisan(['migrate', '--force'])"), strpos($launcher, 'const mailpitIsRunning'));
        self::assertStringContainsString('Reusing Mailpit', $launcher);
        self::assertStringContainsString('Mailpit was not found', $launcher);
        self::assertStringContainsString('Set MAILPIT_BIN to the Mailpit executable.', $launcher);
        self::assertStringContainsString("join(localAppData, 'Programs', 'Mailpit', 'mailpit.exe')", $launcher);
        self::assertStringContainsString("entry.name.toLowerCase().startsWith('axllent.mailpit_')", $launcher);
        self::assertStringContainsString('shutdown(1)', substr($launcher, strpos($launcher, 'Mailpit was not found'), 180));
        self::assertStringContainsString("start(mailpit, ['--listen'", $launcher);
        self::assertStringContainsString('console.log(`Prepared demo database: ${database}`)', $launcher);
        $doctor = file_get_contents(dirname(__DIR__, 2).'/scripts/windows/doctor.ps1');
        self::assertStringContainsString("'Programs\\Mailpit\\mailpit.exe'", $doctor);
        self::assertStringContainsString("'axllent.mailpit_*'", $doctor);
        $mail = file_get_contents(dirname(__DIR__, 2).'/config/mail.php');
        self::assertStringContainsString("'default' => env('MAIL_MAILER', 'smtp')", $mail);
        self::assertStringContainsString("'host' => env('MAIL_HOST', '127.0.0.1')", $mail);
        self::assertStringContainsString("'port' => (int) env('MAIL_PORT', 1025)", $mail);
        self::assertFileExists(dirname(__DIR__, 2).'/scripts/dev/seed-demo.php');
        self::assertLessThan(
            strpos($launcher, "run(php, ['scripts/dev/seed-demo.php'], environment)"),
            strpos($launcher, "artisan(['migrate', '--force'])"),
        );
        self::assertLessThan(
            strpos($launcher, "start(php, ['artisan', 'serve'"),
            strpos($launcher, "run(php, ['scripts/dev/seed-demo.php'], environment)"),
        );
        $seed = file_get_contents(dirname(__DIR__, 2).'/scripts/dev/seed-demo.php');
        self::assertStringContainsString("array_key_exists('firmledger:demo-seed', Artisan::all())", $seed);
        self::assertStringContainsString("if (is_file(\$credentialsFile))", $seed);
        self::assertStringContainsString("preg_match('/^Password: (.+)\$/m'", $seed);
        self::assertLessThan(
            strpos($seed, "foreach (\$accounts as [\$name, \$email, \$role])"),
            strpos($seed, "if (is_file(\$credentialsFile))"),
        );
        self::assertStringContainsString("if (DB::table('users')->where('email', \$email)->exists())", $seed);
        self::assertStringContainsString("if (DB::table('users')->exists())", $seed);

        $vite = file_get_contents(dirname(__DIR__, 2).'/vite.config.ts');
        self::assertStringContainsString("import laravel from 'laravel-vite-plugin'", $vite);
        self::assertStringContainsString("input: ['resources/css/app.css', 'resources/js/app.ts']", $vite);
        self::assertStringContainsString('refresh: true', $vite);
        self::assertStringContainsString("hotFile: process.env.VITE_HOT_FILE ?? 'public/hot'", $vite);
        self::assertStringContainsString("port: Number(process.env.VITE_PORT ?? 5173)", $vite);

        $view = file_get_contents(dirname(__DIR__, 2).'/resources/views/app.blade.php');
        self::assertStringContainsString("useHotFile(env('VITE_HOT_FILE', public_path('hot')))", $view);
        self::assertFileDoesNotExist(dirname(__DIR__, 2).'/public/hot');
    }
}

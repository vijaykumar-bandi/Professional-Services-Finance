import { render, screen } from '@testing-library/vue'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import AppShell from '../components/shared/AppShell.vue'

describe('application setup', () => {
  it('provides an accessible application shell', () => {
    render(AppShell, { slots: { default: '<h1>Dashboard</h1>' } })

    expect(screen.getByRole('link', { name: 'Skip to main content' }).getAttribute('href')).toBe('#main-content')
    expect(screen.getByRole('main')).toBeTruthy()
  })

  it('installs locked dependencies before preparing the selected database', () => {
    const launcher = readFileSync(resolve(process.cwd(), 'scripts/dev/start.mjs'), 'utf8')

    expect(launcher).toContain('const composerScript = resolveComposerScript()')
    expect(launcher).toContain("installWhenLockChanges('composer.lock'")
    expect(launcher).toContain("installWhenLockChanges('package-lock.json'")
    expect(launcher.indexOf('run(php, [composerScript')).toBeLessThan(launcher.indexOf("artisan(['migrate', '--force'])"))
    expect(launcher.indexOf('run(npm')).toBeLessThan(launcher.indexOf("artisan(['migrate', '--force'])"))
    expect(launcher).toContain("resolve('storage/framework/views')")
    expect(launcher.indexOf('const runtimeDirectories')).toBeLessThan(
      launcher.indexOf("artisan(['migrate', '--force'])"),
    )
    expect(launcher).toContain("run(php, ['scripts/dev/seed-demo.php'], environment)")
    expect(launcher.indexOf("artisan(['migrate', '--force'])")).toBeLessThan(
      launcher.indexOf("run(php, ['scripts/dev/seed-demo.php'], environment)"),
    )
    expect(launcher).toContain('!(await available(port)) || !(await available(vitePort))')
    expect(launcher).toContain('VITE_PORT: String(vitePort)')
    expect(launcher).toContain('environment.VITE_HOT_FILE = resolve(`storage/framework/vite-${port}.hot`)')
    expect(launcher).toContain('unlinkSync(environment.VITE_HOT_FILE)')
    expect(launcher).toContain("['run', 'vite', '--', '--port', String(vitePort)]")
    expect(launcher).toContain("if (!existsSync('.env')) copyFileSync('.env.example', '.env')")
    expect(launcher).toContain("run(php, ['artisan', 'key:generate', '--force'], environment)")
    expect(launcher).toContain("resolvePort(process.env.MAILPIT_SMTP_PORT, 1025, 'MAILPIT_SMTP_PORT')")
    expect(launcher).toContain('MAIL_HOST: host')
    expect(launcher).toContain('MAIL_PORT: String(mailpitSmtpPort)')
    expect(launcher.indexOf('MAIL_PORT: String(mailpitSmtpPort)')).toBeLessThan(
      launcher.indexOf("run(php, ['artisan', 'key:generate', '--force'], environment)"),
    )
    expect(launcher.indexOf('MAIL_PORT: String(mailpitSmtpPort)')).toBeLessThan(
      launcher.indexOf("artisan(['migrate', '--force'])"),
    )
    expect(launcher.indexOf('MAIL_PORT: String(mailpitSmtpPort)')).toBeLessThan(
      launcher.indexOf("run(php, ['scripts/dev/seed-demo.php'], environment)"),
    )
    expect(launcher).toContain('Reusing Mailpit')
    expect(launcher).toContain('Mailpit was not found')
    expect(launcher).toContain("join(localAppData, 'Programs', 'Mailpit', 'mailpit.exe')")
    expect(launcher).toContain("entry.name.toLowerCase().startsWith('axllent.mailpit_')")
    expect(launcher).toContain("start(mailpit, ['--listen'")
    expect(launcher.indexOf('MAIL_PORT: String(mailpitSmtpPort)')).toBeLessThan(
      launcher.indexOf("start(php, ['artisan', 'serve'"),
    )
    expect(launcher.indexOf('const mailpitSmtpPort')).toBeLessThan(
      launcher.indexOf("run(php, ['artisan', 'key:generate'"),
    )
    expect(launcher.indexOf('const mailpitIsRunning')).toBeLessThan(
      launcher.indexOf("artisan(['migrate', '--force'])"),
    )
  })

  it('uses Laravel Vite integration for development and production assets', () => {
    const vite = readFileSync(resolve(process.cwd(), 'vite.config.ts'), 'utf8')

    expect(vite).toContain("import laravel from 'laravel-vite-plugin'")
    expect(vite).toContain("input: ['resources/css/app.css', 'resources/js/app.ts']")
    expect(vite).toContain('refresh: true')
    expect(vite).toContain("hotFile: process.env.VITE_HOT_FILE ?? 'public/hot'")
    expect(vite).toContain('port: Number(process.env.VITE_PORT ?? 5173)')

    const view = readFileSync(resolve(process.cwd(), 'resources/views/app.blade.php'), 'utf8')
    expect(view).toContain("useHotFile(env('VITE_HOT_FILE', public_path('hot')))")
  })

  it('discovers feature route modules without central router edits', () => {
    const router = readFileSync(resolve(process.cwd(), 'resources/js/router/index.ts'), 'utf8')

    expect(router).toContain("import.meta.glob<RouteModule>('./routes/**/*.ts', { eager: true })")
    expect(router).toContain('.flatMap((path) =>')
    expect(router).toContain('...featureRoutes')
  })

  it('reserves the root URL for the Vue shell', () => {
    const bootstrap = readFileSync(resolve(process.cwd(), 'bootstrap/app.php'), 'utf8')
    const webRoutes = readFileSync(resolve(process.cwd(), 'routes/web.php'), 'utf8')

    expect(bootstrap).not.toContain('health: false')
    expect(bootstrap).not.toContain("health: '/'")
    expect(webRoutes).toContain("Route::view('/{path?}', 'app')")
  })
})

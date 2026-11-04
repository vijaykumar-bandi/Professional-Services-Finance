# FirmLedger

FirmLedger is the professional-services finance application for Northline Advisory. It uses Laravel 13, Vue 3, TypeScript, Vite and a local SQLite database.

## Local development

Requirements: PHP 8.4 with SQLite support, Composer, Node.js, npm and Mailpit. On Windows, run `powershell -ExecutionPolicy Bypass -File scripts/windows/doctor.ps1` first.

```text
composer install
npm install
npm run dev
```

On first setup the launcher copies `.env.example` to the ignored `.env`, generates and persists a local `APP_KEY`, and installs the exact lockfile dependencies. Later launches install again only when a lockfile changes, so a second instance can start while the first instance is using Vite. The launcher starts Mailpit or reuses the instance already listening on its configured SMTP and web ports, migrates only the selected demo database, and requires its additive demo seed to succeed. It then selects unused loopback ports and prints the URL after `/api/health` succeeds.

## Tests

```text
composer test
npm test
```

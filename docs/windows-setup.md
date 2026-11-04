# Windows local setup

Install PHP 8.4, Composer, Node.js, npm and Mailpit. Ensure PHP enables `pdo_sqlite` and the other standard Laravel extensions. Put `mailpit.exe` on `PATH`, or select it with `MAILPIT_BIN`. A custom PHP executable can be selected for every setup command with `PHP_BIN`.

From PowerShell in the repository root:

```powershell
$env:PHP_BIN = 'C:\path\to\php.exe' # optional
powershell -ExecutionPolicy Bypass -File scripts/windows/doctor.ps1
$env:PORT = '8000' # optional preferred port
npm run dev
```

`npm run dev` installs the exact Composer and npm dependency versions on first setup and whenever either lockfile changes. An unchanged second launch does not replace dependency files held by the first Vite process. The launcher creates `.env` from `.env.example` when needed and persists a generated local `APP_KEY`. It starts Mailpit on `127.0.0.1:1025` and `127.0.0.1:8025`, or reuses Mailpit when both ports are already listening. Set `MAILPIT_SMTP_PORT` and `MAILPIT_WEB_PORT` before `npm run dev` to change those ports; the launcher passes the selected SMTP endpoint to every Laravel command as `MAIL_HOST=127.0.0.1` and `MAIL_PORT`, while `1025` remains the SMTP default.

The launcher binds only to `127.0.0.1`, creates the selected SQLite file under `FIRMLEDGER_DATA_DIR`, runs migrations and requires the repeat-safe demo seed to succeed, then starts Laravel and Vite. This creates the five local test logins in an empty selected database while preserving them and all other existing demo work on later runs. If `PORT` or the paired Vite port is occupied, the launcher checks successive pairs without stopping or changing the existing process. The actual URL is printed only after the launcher receives a successful response from `/api/health`.

The generated demo credentials file is ignored by Git. Keep it private and use the five role-specific accounts documented by the running setup.

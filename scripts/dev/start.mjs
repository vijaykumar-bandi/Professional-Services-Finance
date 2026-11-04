import { spawn, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createServer } from 'node:net'
import { closeSync, copyFileSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'

const host = '127.0.0.1'
const preferredPort = Number.parseInt(process.env.PORT ?? '8000', 10)
const php = process.env.PHP_BIN || 'php'
const composer = process.env.COMPOSER_BIN || 'composer'
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const requestedMailpit = process.env.MAILPIT_BIN || 'mailpit'

function resolvePort(value, fallback, name) {
  const port = Number.parseInt(value ?? String(fallback), 10)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error(`${name} must be an integer between 1 and 65535.`)
    process.exit(1)
  }
  return port
}

function needsShell(command) {
  return process.platform === 'win32'
    && (!existsSync(command) || /\.(?:bat|cmd)$/i.test(command))
}

function commandExists(command) {
  if (existsSync(command)) return true
  const locator = process.platform === 'win32' ? 'where.exe' : 'which'
  return spawnSync(locator, [command], { stdio: 'ignore', shell: false }).status === 0
}

function resolveMailpit(command) {
  if (commandExists(command)) return command
  if (process.platform !== 'win32' || process.env.MAILPIT_BIN) return command
  const localAppData = process.env.LOCALAPPDATA
  if (!localAppData) return command

  const programsCandidate = join(localAppData, 'Programs', 'Mailpit', 'mailpit.exe')
  if (existsSync(programsCandidate)) return programsCandidate

  const winget = join(localAppData, 'Microsoft', 'WinGet', 'Packages')
  if (!existsSync(winget)) return command
  const wingetDirectory = readdirSync(winget, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name.toLowerCase().startsWith('axllent.mailpit_'))
  const wingetCandidate = wingetDirectory ? join(winget, wingetDirectory.name, 'mailpit.exe') : command
  return existsSync(wingetCandidate) ? wingetCandidate : command
}

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, { stdio: 'inherit', env, shell: needsShell(command) })
  if (result.error) {
    console.error(`Unable to run ${command}: ${result.error.message}`)
    process.exit(1)
  }
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function resolveComposerScript() {
  if (existsSync(composer) && !['.bat', '.cmd'].includes(extname(composer).toLowerCase())) {
    return resolve(composer)
  }

  const locator = process.platform === 'win32' ? 'where.exe' : 'which'
  const located = spawnSync(locator, [composer], { encoding: 'utf8', shell: false })
  const candidates = (located.stdout ?? '').split(/\r?\n/).filter(Boolean)

  for (const candidate of candidates) {
    if (!['.bat', '.cmd'].includes(extname(candidate).toLowerCase())) return candidate

    const phar = resolve(dirname(candidate), 'composer.phar')
    if (existsSync(phar)) return phar
  }

  console.error(`Unable to resolve ${composer} to a Composer PHP script. Set COMPOSER_BIN to composer.phar.`)
  process.exit(1)
}

const composerScript = resolveComposerScript()
const mailpit = resolveMailpit(requestedMailpit)

mkdirSync(resolve('storage/framework'), { recursive: true })
function installWhenLockChanges(lockfile, stampfile, installed, install) {
  const digest = createHash('sha256').update(readFileSync(lockfile)).digest('hex')
  if (!existsSync(installed) || !existsSync(stampfile) || readFileSync(stampfile, 'utf8').trim() !== digest) {
    install()
    writeFileSync(stampfile, `${digest}\n`)
  }
}

installWhenLockChanges('composer.lock', resolve('storage/framework/composer-lock.sha256'), 'vendor/autoload.php', () => {
  run(php, [composerScript, 'install', '--no-interaction', '--prefer-dist'])
})
installWhenLockChanges('package-lock.json', resolve('storage/framework/npm-lock.sha256'), 'node_modules/.package-lock.json', () => {
  run(npm, ['ci', '--ignore-scripts'])
})

if (!existsSync('.env')) copyFileSync('.env.example', '.env')

const dataDir = resolve(process.env.FIRMLEDGER_DATA_DIR ?? 'storage/demo')
const database = resolve(process.env.DB_DATABASE ?? `${dataDir}/firmledger.sqlite`)
const runtimeDirectories = [
  dataDir,
  resolve('storage/framework/cache/data'),
  resolve('storage/framework/sessions'),
  resolve('storage/framework/views'),
  resolve('storage/logs'),
]
for (const directory of runtimeDirectories) mkdirSync(directory, { recursive: true })
if (!existsSync(database)) closeSync(openSync(database, 'a'))

function available(port) {
  return new Promise((answer) => {
    const server = createServer()
    server.once('error', () => answer(false))
    server.listen(port, host, () => server.close(() => answer(true)))
  })
}

let port = preferredPort
let vitePort = preferredPort + 1000
while (!(await available(port)) || !(await available(vitePort))) {
  port += 1
  vitePort = port + 1000
}

// Resolve Mailpit before any Laravel command. The same immutable environment is
// supplied to key generation, migrations, demo seeding, and the web process.
const mailpitSmtpPort = resolvePort(process.env.MAILPIT_SMTP_PORT, 1025, 'MAILPIT_SMTP_PORT')
const mailpitWebPort = resolvePort(process.env.MAILPIT_WEB_PORT, 8025, 'MAILPIT_WEB_PORT')
const environment = {
  ...process.env,
  APP_ENV: 'local',
  APP_URL: `http://${host}:${port}`,
  DB_CONNECTION: 'sqlite',
  DB_DATABASE: database,
  MAIL_HOST: host,
  MAIL_PORT: String(mailpitSmtpPort),
  PORT: String(port),
  VITE_PORT: String(vitePort),
}
environment.VITE_HOT_FILE = resolve(`storage/framework/vite-${port}.hot`)

const children = []
let stopping = false
function shutdown(code = 0) {
  if (stopping) return
  stopping = true
  for (const child of children) child.kill()
  try {
    if (existsSync(environment.VITE_HOT_FILE)) unlinkSync(environment.VITE_HOT_FILE)
  } catch {}
  process.exit(code)
}
const start = (command, args, extra = {}) => {
  const child = spawn(command, args, { stdio: 'inherit', env: environment, shell: needsShell(command), ...extra })
  children.push(child)
  child.once('error', (error) => {
    console.error(`Unable to start ${command}: ${error.message}`)
    shutdown(1)
  })
  child.once('exit', (code) => { if (code && !stopping) shutdown(code) })
}
process.on('SIGINT', () => shutdown())
process.on('SIGTERM', () => shutdown())

const mailpitIsRunning = !(await available(mailpitSmtpPort)) && !(await available(mailpitWebPort))
if (mailpitIsRunning) {
  console.log(`Reusing Mailpit at http://${host}:${mailpitWebPort} (SMTP ${host}:${mailpitSmtpPort})`)
} else if ((await available(mailpitSmtpPort)) && (await available(mailpitWebPort))) {
  if (commandExists(mailpit)) {
    start(mailpit, ['--listen', `${host}:${mailpitWebPort}`, '--smtp', `${host}:${mailpitSmtpPort}`])
  } else {
    console.error(`Mailpit was not found (${mailpit}). Set MAILPIT_BIN to the Mailpit executable.`)
    shutdown(1)
  }
} else {
  console.error('Mailpit ports are only partly available. Stop the conflicting process or set MAILPIT_SMTP_PORT and MAILPIT_WEB_PORT.')
  shutdown(1)
}

const keyMatch = readFileSync('.env', 'utf8').match(/^APP_KEY=(.*)$/m)
if (!keyMatch || keyMatch[1].trim() === '') run(php, ['artisan', 'key:generate', '--force'], environment)
const artisan = (args, optional = false) => {
  const result = spawnSync(php, ['artisan', ...args], { stdio: optional ? 'ignore' : 'inherit', env: environment, shell: false })
  if (!optional && result.status !== 0) process.exit(result.status ?? 1)
  return result.status === 0
}

artisan(['migrate', '--force'])
run(php, ['scripts/dev/seed-demo.php'], environment)
console.log(`Prepared demo database: ${database}`)

start(php, ['artisan', 'serve', '--host', host, '--port', String(port)])
start(npm, ['run', 'vite', '--', '--port', String(vitePort)])

const health = `http://${host}:${port}/api/health`
for (let attempt = 0; attempt < 60; attempt += 1) {
  try {
    const response = await fetch(health)
    if (response.ok) {
      console.log(`FirmLedger is ready at http://${host}:${port}`)
      break
    }
  } catch {}
  await new Promise((wait) => setTimeout(wait, 500))
  if (attempt === 59) shutdown(1)
}

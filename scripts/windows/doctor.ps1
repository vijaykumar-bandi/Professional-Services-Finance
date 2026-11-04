$ErrorActionPreference = 'Continue'
$missing = [System.Collections.Generic.HashSet[string]]::new()

function Resolve-Tool([string]$Name, [string]$Override = '') {
    if ($Override) {
        if (Test-Path $Override -PathType Leaf) { return (Resolve-Path $Override).Path }
        [void]$missing.Add("$Name ($Override)")
        return $null
    }
    $command = Get-Command $Name -ErrorAction SilentlyContinue
    if ($command) { return $command.Source }
    if ($Name -eq 'Mailpit' -and $env:LOCALAPPDATA) {
        $programsCandidate = Join-Path $env:LOCALAPPDATA 'Programs\Mailpit\mailpit.exe'
        if (Test-Path $programsCandidate -PathType Leaf) { return $programsCandidate }
        $wingetRoot = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
        $wingetCandidate = Get-ChildItem -Path $wingetRoot -Filter 'mailpit.exe' -File -Recurse -ErrorAction SilentlyContinue |
            Where-Object { $_.Directory.Name -like 'axllent.mailpit_*' } |
            Select-Object -First 1 -ExpandProperty FullName
        if ($wingetCandidate) { return $wingetCandidate }
    }
    [void]$missing.Add($Name)
    return $null
}

$node = Resolve-Tool 'Node' ''
$php = Resolve-Tool 'PHP' $env:PHP_BIN
$composer = Resolve-Tool 'Composer' ''
$mailpit = Resolve-Tool 'Mailpit' $env:MAILPIT_BIN

if ($php) {
    $version = & $php -r "echo PHP_VERSION;"
    if ([version]$version -lt [version]'8.4.0') { [void]$missing.Add('PHP 8.4 or newer') }
    $extensions = & $php -r "echo implode(PHP_EOL, get_loaded_extensions());"
    foreach ($required in @('ctype', 'curl', 'dom', 'fileinfo', 'filter', 'hash', 'mbstring', 'openssl', 'pdo', 'pdo_sqlite', 'session', 'tokenizer', 'xml')) {
        if ($extensions -notcontains $required) { [void]$missing.Add("PHP extension $required") }
    }
}

$dataDirectory = if ($env:FIRMLEDGER_DATA_DIR) { $env:FIRMLEDGER_DATA_DIR } else { Join-Path $PSScriptRoot '..\..\storage\demo' }
try {
    New-Item -ItemType Directory -Force -Path $dataDirectory | Out-Null
    $probe = Join-Path $dataDirectory '.write-probe'
    [IO.File]::WriteAllText($probe, 'ok')
    Remove-Item $probe -Force
} catch { [void]$missing.Add("writable data directory $dataDirectory") }

if ($missing.Count -gt 0) {
    $missing | Sort-Object | ForEach-Object { Write-Error "Missing prerequisite: $_" }
    exit 1
}

Write-Host "Node: $node"
Write-Host "PHP: $php"
Write-Host "Composer: $composer"
Write-Host "Mailpit: $mailpit"
Write-Host "Data directory: $dataDirectory"
Write-Host 'FirmLedger prerequisites are ready.'

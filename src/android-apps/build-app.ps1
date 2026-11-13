<#
  Build one Codelove Android app by its id from src/data/apps.js.

    .\build-app.ps1 clipdropper              # signed release APK → dist\clipdropper-v1.2.0.apk
    .\build-app.ps1 clipdropper -Debug       # debug APK
    .\build-app.ps1 clipdropper -Publish     # also copies it to ..\..\public\downloads\clipdropper.apk
    .\build-app.ps1 -All                     # every app, release
    .\build-app.ps1 -Sync                    # only re-generate flavors/icons from apps.js

  Run `node tools/sync-apps.mjs` (or -Sync) after editing apps.js; the build does it for you.
#>
param(
    [string]$AppId,
    [switch]$Debug,
    [switch]$Publish,
    [switch]$All,
    [switch]$Sync
)

# Native tools write warnings to stderr; keep those from being turned into errors
$ErrorActionPreference = "Continue"
$root = $PSScriptRoot
Set-Location $root

# No Android Studio on this PC: fall back to the JDK + SDK in java-game-emu\toolchain
$toolchain = Join-Path $root "..\..\..\java-game-emu\toolchain"
if (-not $env:JAVA_HOME -and (Test-Path "$toolchain\jdk-21.0.12.1+1")) { $env:JAVA_HOME = (Resolve-Path "$toolchain\jdk-21.0.12.1+1").Path }
if (-not $env:ANDROID_HOME -and (Test-Path "$toolchain\sdk")) { $env:ANDROID_HOME = (Resolve-Path "$toolchain\sdk").Path }

Write-Host "Syncing flavors from src/data/apps.js ..." -ForegroundColor DarkGray
node --no-warnings tools/sync-apps.mjs
if ($LASTEXITCODE -ne 0) { throw "sync-apps failed" }
if ($Sync) { return }

$apps = Get-Content app/apps.json -Raw | ConvertFrom-Json
if ($All) { $targets = $apps }
elseif ($AppId) {
    $targets = @($apps | Where-Object { $_.id -eq $AppId -or $_.flavor -eq $AppId })
    if ($targets.Count -eq 0) {
        Write-Host "Unknown app '$AppId'. Available:" -ForegroundColor Red
        $apps | ForEach-Object { Write-Host "  $($_.id)" }
        exit 1
    }
}
else {
    Write-Host "Usage: .\build-app.ps1 <app-id> [-Debug] [-Publish]   or   -All" -ForegroundColor Yellow
    $apps | ForEach-Object { Write-Host "  $($_.id.PadRight(14)) $($_.name)  v$($_.versionName)" }
    exit 1
}

$buildType = if ($Debug) { "Debug" } else { "Release" }
[string[]]$tasks = @($targets | ForEach-Object { "assemble$((Get-Culture).TextInfo.ToTitleCase($_.flavor))$buildType" })

# One app at a time: building all release flavors in one Gradle run needs more memory than this PC has.
# Each app is retried a few times, because the internet here drops DNS now and then (and Gradle's daemon can die).
foreach ($task in $tasks) {
    Write-Host "Building $task ..." -ForegroundColor Cyan
    for ($try = 1; $try -le 3; $try++) {
        $log = & .\gradlew.bat $task -q --max-workers=2 2>&1
        if ($LASTEXITCODE -eq 0) { break }
        Write-Host "  failed (try $try), retrying..." -ForegroundColor Yellow
    }
    if ($LASTEXITCODE -ne 0) {
        $log | Where-Object { $_ -notmatch '^\s+at ' } | Select-Object -Last 40 | ForEach-Object { Write-Host $_ }
        throw "Gradle build failed: $task"
    }
}

New-Item -ItemType Directory -Force dist | Out-Null
foreach ($app in $targets) {
    $suffix = if ($Debug) { "debug" } else { "release" }
    $src = Join-Path $root "app\build\outputs\apk\$($app.flavor)\$suffix\app-$($app.flavor)-$suffix.apk"
    if (-not (Test-Path $src)) { throw "APK not found: $src (unsigned release? check keystore.properties)" }
    $out = Join-Path $root "dist\$($app.id)-v$($app.versionName)$(if ($Debug) { '-debug' }).apk"
    Copy-Item $src $out -Force
    Write-Host "✓ $($app.name.PadRight(12)) → $out" -ForegroundColor Green
    if ($Publish -and -not $Debug) {
        $pub = Join-Path $root "..\..\public\downloads\$($app.id).apk"
        New-Item -ItemType Directory -Force (Split-Path $pub) | Out-Null
        Copy-Item $src $pub -Force
        Write-Host "  published → public/downloads/$($app.id).apk" -ForegroundColor Green
    }
}

# Tell the website which APKs exist (removes "Coming soon", sets the real size)
if ($Publish -and -not $Debug) {
    Push-Location (Join-Path $root "..\..")
    node scripts/sync-downloads.mjs
    Pop-Location
}

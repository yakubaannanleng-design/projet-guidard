param(
  [ValidateRange(15, 3600)]
  [int]$DebounceSeconds = 60,
  [ValidateRange(5, 300)]
  [int]$PollIntervalSeconds = 10
)

$ErrorActionPreference = "Continue"
$projectRoot = Split-Path -Parent $PSScriptRoot
$remoteName = "origin"
$gitCommand = Get-Command git -ErrorAction SilentlyContinue
$gitCandidates = @(
  "C:\Program Files\Git\cmd\git.exe",
  "C:\Program Files\Git\bin\git.exe",
  (Join-Path $env:LOCALAPPDATA "Programs\Git\cmd\git.exe")
)
$gitExecutable = if ($gitCommand) {
  $gitCommand.Source
} else {
  $gitCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
}
if (-not $gitExecutable) {
  throw "Git for Windows est introuvable. Installe Git, redémarre VS Code, puis relance la tâche."
}
$gitRoot = Split-Path -Parent (Split-Path -Parent $gitExecutable)
$gitHelperDirectory = Join-Path $gitRoot "mingw64\bin"
$gitCommandDirectory = Split-Path -Parent $gitExecutable
$env:PATH = "$gitCommandDirectory;$gitHelperDirectory;$env:PATH"

function Invoke-Git {
  param([string[]]$Arguments)

  $output = @(& $gitExecutable -C $projectRoot @Arguments 2>&1)
  return [pscustomobject]@{
    ExitCode = $LASTEXITCODE
    Output = ($output | Out-String).Trim()
  }
}

$rootResult = Invoke-Git -Arguments @("rev-parse", "--show-prefix")
if ($rootResult.ExitCode -ne 0) {
  throw "Aucun dépôt Git initialisé. Lance scripts\Initialize-GitHub.ps1 une seule fois."
}
if ($rootResult.Output) {
  throw "Le dépôt Git détecté n’est pas la racine de Projet Guidard."
}

$remoteResult = Invoke-Git -Arguments @("remote", "get-url", $remoteName)
if ($remoteResult.ExitCode -ne 0 -or $remoteResult.Output -notmatch "^https://github\.com/yakubaannanleng-design/projet-guidard\.git$") {
  throw "Le dépôt distant privé Projet Guidard n’est pas configuré sur origin."
}

Write-Output "[Guidar sync] AUTOMATIQUE actif — sauvegarde après $DebounceSeconds secondes sans modification."
$initialStatus = Invoke-Git -Arguments @("status", "--porcelain", "--untracked-files=all")
if ($initialStatus.ExitCode -ne 0) {
  throw "Impossible de lire l’état initial du dépôt Git : $($initialStatus.Output)"
}
if (-not $initialStatus.Output) {
  Write-Output "[Guidar sync] Aucun changement en attente ; la surveillance est prête."
}
$lastStatus = $null
$lastChangeAt = $null
$pendingPush = $false
$nextPushAt = Get-Date

while ($true) {
  $statusResult = Invoke-Git -Arguments @("status", "--porcelain", "--untracked-files=all")
  if ($statusResult.ExitCode -ne 0) {
    Write-Output "[Guidar sync] ERREUR scripts/Watch-And-Sync.ps1: Lecture de l’état Git impossible : $($statusResult.Output)"
    Start-Sleep -Seconds $PollIntervalSeconds
    continue
  }

  $status = $statusResult.Output
  $now = Get-Date
  if ($status -ne $lastStatus) {
    $lastStatus = $status
    if ($status) {
      $lastChangeAt = $now
      Write-Output "[Guidar sync] Modifications detectees ; delai redemarre."
    } else {
      $lastChangeAt = $null
    }
  }

  if ($status -and $lastChangeAt -and ($now - $lastChangeAt).TotalSeconds -ge $DebounceSeconds) {
    $stage = Invoke-Git -Arguments @("add", "--all")
    if ($stage.ExitCode -ne 0) {
      Write-Output "[Guidar sync] ERREUR scripts/Watch-And-Sync.ps1: Ajout des fichiers impossible : $($stage.Output)"
      $lastChangeAt = $now
    } else {
      $staged = Invoke-Git -Arguments @("diff", "--cached", "--quiet")
      if ($staged.ExitCode -eq 1) {
        $timestamp = $now.ToString("yyyy-MM-dd HH:mm:ss")
        $commitMessage = @(
          "Sauvegarde automatique Guidard - $timestamp"
          ""
          "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
        ) -join "`n"
        $commit = Invoke-Git -Arguments @("commit", "-m", $commitMessage)
        if ($commit.ExitCode -eq 0) {
          Write-Output "[Guidar sync] Version locale créée."
          $pendingPush = $true
          $nextPushAt = $now
        } else {
          Write-Output "[Guidar sync] ERREUR scripts/Watch-And-Sync.ps1: Création de la version impossible : $($commit.Output)"
          $lastChangeAt = $now
        }
      } elseif ($staged.ExitCode -gt 1) {
        Write-Output "[Guidar sync] ERREUR scripts/Watch-And-Sync.ps1: Vérification des fichiers préparés impossible : $($staged.Output)"
        $lastChangeAt = $now
      } else {
        $lastChangeAt = $null
      }
    }
  }

  if ($pendingPush -and $now -ge $nextPushAt) {
    $upstream = Invoke-Git -Arguments @("rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}")
    if ($upstream.ExitCode -eq 0) {
      $push = Invoke-Git -Arguments @("push", $remoteName)
    } else {
      $push = Invoke-Git -Arguments @("push", "--set-upstream", $remoteName, "HEAD")
    }

    if ($push.ExitCode -eq 0) {
      Write-Output "[Guidar sync] Synchronisation GitHub terminée."
      $pendingPush = $false
    } else {
      Write-Output "[Guidar sync] ERREUR scripts/Watch-And-Sync.ps1: Envoi GitHub impossible ; nouvelle tentative dans 60 secondes : $($push.Output)"
      $nextPushAt = $now.AddSeconds(60)
    }
  }

  Start-Sleep -Seconds $PollIntervalSeconds
}

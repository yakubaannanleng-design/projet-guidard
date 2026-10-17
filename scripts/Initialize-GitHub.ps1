param(
  [string]$RemoteUrl = "https://github.com/yakubaannanleng-design/projet-guidard.git"
)

$ErrorActionPreference = "Continue"
$projectRoot = Split-Path -Parent $PSScriptRoot
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
  throw "Git for Windows est introuvable. Installe Git, redémarre VS Code, puis relance ce script."
}
$gitRoot = Split-Path -Parent (Split-Path -Parent $gitExecutable)
$gitHelperDirectory = Join-Path $gitRoot "mingw64\bin"
$gitCommandDirectory = Split-Path -Parent $gitExecutable
$env:PATH = "$gitCommandDirectory;$gitHelperDirectory;$env:PATH"
$env:GCM_INTERACTIVE = "Always"
$env:GIT_TERMINAL_PROMPT = "1"
Remove-Item Env:GIT_ASKPASS -ErrorAction SilentlyContinue
if (Test-Path -LiteralPath (Join-Path $projectRoot ".git")) {
  throw "Ce dossier contient déjà un dépôt Git. Initialisation annulée pour préserver son historique."
}

$clonePath = Join-Path (Split-Path -Parent $projectRoot) (".projet-guidard-init-" + [guid]::NewGuid().ToString("N"))
$clone = & $gitExecutable clone $RemoteUrl $clonePath 2>&1
if ($LASTEXITCODE -ne 0) {
  throw "Clonage du dépôt privé impossible. Vérifie la connexion à GitHub et réessaie. Détails : $($clone -join [Environment]::NewLine)"
}

$items = Get-ChildItem -LiteralPath $projectRoot -Force
foreach ($item in $items) {
  Copy-Item -LiteralPath $item.FullName -Destination $clonePath -Recurse -Force -ErrorAction Stop
}

$configName = & $gitExecutable -C $clonePath config user.name 2>$null
if ($LASTEXITCODE -ne 0 -or -not $configName) {
  $configName = "yakubaannanleng-design"
  & $gitExecutable -C $clonePath config user.name $configName
  if ($LASTEXITCODE -ne 0) { throw "Impossible de configurer le nom d’auteur Git local." }
}

$configEmail = & $gitExecutable -C $clonePath config user.email 2>$null
if ($LASTEXITCODE -ne 0 -or -not $configEmail) {
  $configEmail = "285037446+yakubaannanleng-design@users.noreply.github.com"
  & $gitExecutable -C $clonePath config user.email $configEmail
  if ($LASTEXITCODE -ne 0) { throw "Impossible de configurer l’adresse Git privée locale." }
}

$stage = & $gitExecutable -C $clonePath add --all 2>&1
if ($LASTEXITCODE -ne 0) {
  throw "Impossible de préparer les fichiers pour Git. Détails : $($stage -join [Environment]::NewLine)"
}

$hasChanges = & $gitExecutable -C $clonePath diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
  $commitMessage = @(
    "Ajouter les fichiers modulaires de l’application"
    ""
    "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
  ) -join "`n"
  $commit = & $gitExecutable -C $clonePath commit -m $commitMessage 2>&1
  if ($LASTEXITCODE -ne 0) {
    throw "Création de la version Git impossible. Détails : $($commit -join [Environment]::NewLine)"
  }
} elseif ($LASTEXITCODE -ne 0) {
  throw "Impossible de vérifier les fichiers préparés pour Git."
}

$push = & $gitExecutable -C $clonePath push 2>&1
if ($LASTEXITCODE -ne 0) {
  throw "Envoi initial vers GitHub impossible. La copie locale n’a pas encore été reliée au dépôt. Détails : $($push -join [Environment]::NewLine)"
}

$metadataSource = Join-Path $clonePath ".git"
$metadataDestination = Join-Path $projectRoot ".git"
Move-Item -LiteralPath $metadataSource -Destination $metadataDestination -ErrorAction Stop
$rootCheck = & $gitExecutable -C $projectRoot rev-parse --show-toplevel 2>&1
if ($LASTEXITCODE -ne 0 -or [IO.Path]::GetFullPath(($rootCheck | Out-String).Trim()) -ne [IO.Path]::GetFullPath($projectRoot)) {
  throw "Les fichiers du depot Git n'ont pas ete relies au dossier du projet."
}
Remove-Item -LiteralPath $clonePath -Recurse -Force -ErrorAction Stop

Write-Output "Dépôt GitHub relié. Les fichiers de l’application et son historique sont synchronisés."
Write-Output "Ouvre ce dossier comme espace de travail VS Code et autorise la tâche « Guidard : synchronisation automatique »."

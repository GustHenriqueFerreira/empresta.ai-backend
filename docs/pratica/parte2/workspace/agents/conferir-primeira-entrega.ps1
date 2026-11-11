[CmdletBinding()]
param(
  [string]$ZipPath = (Join-Path ([Environment]::GetFolderPath('Desktop')) 'emprestai-entrega-professor-2026-11-05.zip')
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$zip = [IO.Compression.ZipFile]::OpenRead($ZipPath)
$differences = @()
$count = 0
try {
  foreach ($entry in $zip.Entries) {
    if ($entry.FullName.EndsWith('/')) { continue }
    if (-not $entry.FullName.StartsWith('emprestai/')) { throw 'Entrada inesperada no ZIP de referência.' }
    $relative = $entry.FullName.Substring('emprestai/'.Length)
    $target = [IO.Path]::GetFullPath((Join-Path $projectRoot $relative))
    if (-not $target.StartsWith($projectRoot + [IO.Path]::DirectorySeparatorChar)) { throw 'Caminho fora do projeto.' }
    $count++
    if (-not (Test-Path -LiteralPath $target -PathType Leaf)) { $differences += $relative; continue }
    $stream = $entry.Open()
    $sha = [Security.Cryptography.SHA256]::Create()
    try { $expected = [BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-', '') }
    finally { $stream.Dispose(); $sha.Dispose() }
    if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $expected) { $differences += $relative }
  }
} finally { $zip.Dispose() }
if ($differences.Count) {
  $differences | ForEach-Object { Write-Output ('Diferente ou ausente: ' + $_) }
  throw 'Primeira entrega não preservada; não prosseguir.'
}
Write-Output ($count.ToString() + ' arquivos originais idênticos ao ZIP. Apenas arquivos adicionais são permitidos.')

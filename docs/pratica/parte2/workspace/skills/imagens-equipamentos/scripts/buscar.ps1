[CmdletBinding(DefaultParameterSetName='Um')]
param(
  [Parameter(Mandatory=$true,ParameterSetName='Um')][ValidatePattern('^TI-00(0[1-9]|1[0-2])$')][string]$Patrimonio,
  [Parameter(Mandatory=$true,ParameterSetName='Todos')][switch]$Todos,
  [ValidatePattern('^[a-z0-9][a-z0-9-]{0,39}$')][string]$Lote = 'principal'
)
$ErrorActionPreference = 'Stop'
$skillDirectory = Split-Path -Parent $PSScriptRoot
$projectDirectory = Split-Path -Parent (Split-Path -Parent $skillDirectory)
$tsxPath = Join-Path $projectDirectory 'backend/node_modules/tsx/dist/cli.mjs'
$cliPath = Join-Path $PSScriptRoot 'cli.ts'
$privateValue = Read-Host 'Chave Pixabay (privada; nao cole no chat)' -AsSecureString
$pointer = [IntPtr]::Zero
$process = $null
$targets = if ($Todos) { @(1..12 | ForEach-Object { 'TI-{0:D4}' -f $_ }) } else { @($Patrimonio) }
try {
  $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($privateValue)
  $privateText = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
  foreach ($target in $targets) {
    $startInfo = [Diagnostics.ProcessStartInfo]::new()
    $startInfo.FileName = (Get-Command node).Source
    $startInfo.Arguments = '"' + $tsxPath + '" "' + $cliPath + '" --lote ' + $Lote + ' buscar ' + $target
    $startInfo.UseShellExecute = $false
    $startInfo.CreateNoWindow = $true
    $startInfo.RedirectStandardInput = $true
    $startInfo.RedirectStandardOutput = $true
    $startInfo.WorkingDirectory = $skillDirectory
    $process = [Diagnostics.Process]::Start($startInfo)
    $process.StandardInput.WriteLine($privateText)
    $process.StandardInput.Close()
    $publicResult = $process.StandardOutput.ReadToEnd()
    $process.WaitForExit()
    if ($process.ExitCode -ne 0) { throw 'Busca interrompida. Chave nao foi gravada; resultados anteriores foram preservados.' }
    if ($Todos) {
      $candidates = @($publicResult | ConvertFrom-Json)
      Write-Host ('{0}: {1} candidatas em cache. Nenhuma aprovacao automatica.' -f $target, $candidates.Count)
    } else { Write-Output $publicResult }
    $process.Dispose()
    $process = $null
  }
} finally {
  if ($pointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
  $privateText = $null
  $privateValue.Dispose()
  if ($null -ne $process) { $process.Dispose() }
}

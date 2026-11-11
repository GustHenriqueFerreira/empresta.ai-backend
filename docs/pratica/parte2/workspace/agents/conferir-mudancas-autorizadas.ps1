[CmdletBinding()]
param([string]$ZipPath=(Join-Path ([Environment]::GetFolderPath('Desktop')) 'emprestai-entrega-professor-2026-11-05.zip'))
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$raizProjeto=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$permitidos=@('backend/prisma/schema.prisma','backend/src/app.service.ts','backend/src/app.service.spec.ts','frontend/src/types.ts','frontend/src/App.tsx','frontend/src/features/catalogo/Catalogo.tsx','frontend/src/features/catalogo/Catalogo.css','frontend/src/components/Dialog.tsx')
$zip=[IO.Compression.ZipFile]::OpenRead($ZipPath)
$iguais=0; $alterados=@(); $indevidos=@()
try {
 foreach($entrada in $zip.Entries){
  if($entrada.FullName.EndsWith('/')){continue}
  if(-not $entrada.FullName.StartsWith('emprestai/')){throw 'Entrada inesperada'}
  $relativo=$entrada.FullName.Substring('emprestai/'.Length)
  $alvo=[IO.Path]::GetFullPath((Join-Path $raizProjeto $relativo))
  if(-not $alvo.StartsWith($raizProjeto+[IO.Path]::DirectorySeparatorChar)){throw 'Fora do projeto'}
  if(-not(Test-Path -LiteralPath $alvo -PathType Leaf)){throw ('Original ausente: '+$relativo)}
  $fluxo=$entrada.Open();$sha=[Security.Cryptography.SHA256]::Create()
  try{$esperado=[BitConverter]::ToString($sha.ComputeHash($fluxo)).Replace('-','')}finally{$fluxo.Dispose();$sha.Dispose()}
  if((Get-FileHash -LiteralPath $alvo -Algorithm SHA256).Hash -eq $esperado){$iguais++}
  elseif($permitidos -contains $relativo){$alterados+=$relativo}else{$indevidos+=$relativo}
 }
}finally{$zip.Dispose()}
if($indevidos.Count){$indevidos|ForEach-Object{Write-Output ('Mudança não autorizada: '+$_)};throw 'Mudança fora do escopo'}
Write-Output ($iguais.ToString()+' originais idênticos; '+$alterados.Count.ToString()+' alterações funcionais/teste autorizadas; nenhum original removido.')
$alterados|ForEach-Object{Write-Output ('Alteração necessária: '+$_)}

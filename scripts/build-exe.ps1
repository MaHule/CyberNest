$csc = 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe'
$root = (Resolve-Path "$PSScriptRoot\..").Path
$icon = Join-Path $root 'src-tauri\icons\icon.ico'
$out = Join-Path $root 'CyberNest.exe'
$src = Join-Path $root 'launcher\Program.cs'

Write-Host "Compiling native CyberNest.exe..." -ForegroundColor Cyan
& $csc /target:winexe /win32icon:$icon /out:$out /r:System.Windows.Forms.dll,System.dll,System.Drawing.dll $src

if (Test-Path $out) {
    Write-Host "CyberNest.exe successfully generated at: $out" -ForegroundColor Green
} else {
    Write-Error "Compilation failed."
    exit 1
}

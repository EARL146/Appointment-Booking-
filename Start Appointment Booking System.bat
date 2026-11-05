@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing project packages...
  call npm install
  if errorlevel 1 (
    echo.
    echo Package installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)

start "Appointment Booking System server" cmd /k "cd /d ""%~dp0"" && npm run dev"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$url='http://127.0.0.1:5188'; $deadline=(Get-Date).AddSeconds(30); do { try { $page=Invoke-WebRequest -Uri $url -TimeoutSec 1; if ($page.StatusCode -eq 200 -and $page.Content.Contains('Appointment Booking System')) { Start-Process $url; exit 0 } } catch {}; Start-Sleep -Milliseconds 500 } while ((Get-Date) -lt $deadline); Write-Host 'The app did not start. Check the server window for an error.'; pause"

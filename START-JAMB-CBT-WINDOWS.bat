@echo off
title JAMB CBT Practice Engine - Offline Pro
color 0A

echo ========================================================
echo       JAMB CBT PRACTICE EXAM ENGINE - OFFLINE PRO
echo               Powered by Rila Solutions
echo ========================================================
echo.
echo Launching JAMB CBT Practice Engine completely offline...
echo.

:: If pre-compiled dist folder exists, launch the offline server directly
if exist "%~dp0dist\index.html" (
    echo [OK] Pre-compiled offline application found!
    echo Starting native Windows offline server...
    powershell -ExecutionPolicy Bypass -File "%~dp0server-offline.ps1"
    exit /b
)

:: Otherwise fallback to checking Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [NOTICE] Running offline server...
    powershell -ExecutionPolicy Bypass -File "%~dp0server-offline.ps1"
    exit /b
)

if not exist "%~dp0node_modules" (
    echo Installing app packages...
    call npm install
)

start "" http://localhost:3000
call npm run dev

pause

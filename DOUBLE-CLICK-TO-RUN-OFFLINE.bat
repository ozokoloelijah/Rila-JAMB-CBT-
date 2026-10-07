@echo off
title JAMB CBT Practice Engine - Offline Pro
color 0A

echo ========================================================
echo       JAMB CBT PRACTICE EXAM ENGINE - OFFLINE PRO
echo               Powered by Rila Solutions
echo ========================================================
echo.
echo Launching offline exam engine on your Windows PC...
echo No internet connection or installation required!
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0server-offline.ps1"

pause

@echo off
title SkillBridge Launcher
color 0A

echo.
echo  ========================================
echo    SkillBridge - AI Career Platform
echo  ========================================
echo.

:: Kill any old node processes on ports 5000/5173
echo  [1/3] Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5000 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5173 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
timeout /t 1 /nobreak >nul

:: Start Backend
echo  [2/3] Starting Backend on http://localhost:5000 ...
start "SkillBridge Backend" cmd /k "cd /d "%~dp0backend" && node server.js"
timeout /t 3 /nobreak >nul

:: Start Frontend
echo  [3/3] Starting Frontend on http://localhost:5173 ...
start "SkillBridge Frontend" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"
timeout /t 4 /nobreak >nul

:: Open browser
echo.
echo  Opening app in browser...
start "" "http://localhost:5173"

echo.
echo  ========================================
echo   Backend  -> http://localhost:5000
echo   Frontend -> http://localhost:5173
echo  ========================================
echo.
echo  Both servers are running in separate windows.
echo  Close those windows to stop the servers.
echo.
pause

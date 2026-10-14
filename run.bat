@echo off
cd /d "%~dp0"
echo Starting Royal Enfield Showcase Server...
start "" http://localhost:3000
node server.js
pause

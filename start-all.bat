@echo off
REM Start backend and frontend in separate cmd windows
start "Backend" cmd /k "cd /d %~dp0backend && .\mvnw.cmd spring-boot:run"
start "Frontend" cmd /k "cd /d %~dp0frontend && npm start"

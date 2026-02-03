#!/usr/bin/env pwsh
Push-Location $PSScriptRoot

# Start backend in a new PowerShell window
Start-Process -FilePath powershell -ArgumentList "-NoExit","-Command","Set-Location -LiteralPath '$PSScriptRoot\\backend'; .\\mvnw.cmd spring-boot:run"

# Start frontend in a new PowerShell window
Start-Process -FilePath powershell -ArgumentList "-NoExit","-Command","Set-Location -LiteralPath '$PSScriptRoot\\frontend'; npm start"

Pop-Location

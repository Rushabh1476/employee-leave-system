# One-Shot Build and Deploy Script for Windows

Write-Output "Starting Build and Deploy Process..."

# 1. Build Backend
Write-Output "Building Backend (Maven)..."
cd backend
if ($?) {
    .\mvnw.cmd clean package -DskipTests
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Backend Build Failed!"
        exit 1
    }
    cd ..
} else {
    Write-Error "Could not find backend directory!"
    exit 1
}

# 2. Push to GitHub
Write-Output "Pushing to GitHub..."
git add .
git commit -m "Fix: One-Shot Supabase Config (Clean EnvVars)"
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Output "Build and Push Successful! Check Render Dashboard."
} else {
    Write-Error "Git Push Failed!"
}

Read-Host -Prompt "Press Enter to exit"

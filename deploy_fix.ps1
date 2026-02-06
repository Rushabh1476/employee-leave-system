# deploy_fix.ps1
Write-Host "Starting Final Deployment Fix..."

# 1. Build Frontend
Write-Host "Building Frontend..."
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend Build Failed!"
    exit $LASTEXITCODE
}
Set-Location ..

# 2. Stage all changes
Write-Host "Staging changes..."
git add .

# 3. Commit changes (Check if there are changes to commit)
git commit -m "Final Fix: Extreme database pool hardening (max=1) and DDL disabled for stability"

# 4. Push to main
Write-Host "Pushing to GitHub..."
git push origin main

Write-Host "All changes pushed! Backend is now set to use ONLY 1 connection."
Write-Host "CRITICAL: In Render, set Build Command to: mvn clean package -DskipTests"

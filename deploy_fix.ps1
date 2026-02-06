# deploy_fix.ps1
Write-Host "🚀 Starting Deployment Fix..." -ForegroundColor Cyan

# 1. Stage all changes
Write-Host "📦 Staging changes..." -ForegroundColor Yellow
git add .

# 2. Commit changes
$commitMsg = "Fix: Database connection pool limits, CORS updates, and Admin sync fix"
Write-Host "💾 Committing: $commitMsg" -ForegroundColor Yellow
git commit -m $commitMsg

# 3. Push to main
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Fixes deployed! Wait for Render to rebuild." -ForegroundColor Green

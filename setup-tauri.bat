@echo off
echo ============================================
echo Tauri Vending Machine - First Time Setup
echo ============================================
echo.

echo Step 1: Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed

echo.
echo Step 2: Checking Rust...
rustc --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Rust is not installed!
    echo Please install Rust from https://rustup.rs/
    pause
    exit /b 1
)
echo [OK] Rust is installed

echo.
echo Step 3: Installing npm dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install npm dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed

echo.
echo Step 4: Creating placeholder icons...
powershell -ExecutionPolicy Bypass -File create-icons.ps1
if %errorlevel% neq 0 (
    echo [WARNING] Failed to create icons automatically
    echo You may need to create icons manually - see SETUP-INSTRUCTIONS.md
)

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo To run the application in development mode:
echo   npm run dev
echo.
echo To build for production:
echo   npm run build
echo.
echo See SETUP-INSTRUCTIONS.md for more details
echo.
pause

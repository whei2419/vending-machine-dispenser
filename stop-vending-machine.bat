@echo off
echo Stopping Vending Machine Dispenser Services...
echo.

REM Stop Apache
echo Stopping Apache...
taskkill /F /IM httpd.exe >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo Apache stopped.
) else (
    echo Apache was not running.
)

REM Stop MySQL
echo Stopping MySQL...
taskkill /F /IM mysqld.exe >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo MySQL stopped.
) else (
    echo MySQL was not running.
)

echo.
echo All services stopped.
echo Press any key to exit...
pause >nul

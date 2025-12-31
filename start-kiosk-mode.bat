@echo off
echo Starting Vending Machine Dispenser in Kiosk Mode...
echo.

REM Start XAMPP Apache if not already running
echo Checking Apache status...
tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL | find /I /N "httpd.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Apache is already running.
) else (
    echo Starting Apache...
    start "" "C:\xampp\apache_start.bat"
    timeout /t 3 /nobreak >nul
)

REM Start XAMPP MySQL if not already running
echo Checking MySQL status...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MySQL is already running.
) else (
    echo Starting MySQL...
    start "" "C:\xampp\mysql_start.bat"
    timeout /t 3 /nobreak >nul
)

echo.
echo Services started. Opening Chrome in fullscreen...
timeout /t 2 /nobreak >nul

REM Open Chrome in fullscreen with the website
start chrome --start-fullscreen http://localhost/vending-machine-dispenser/index.html

echo.
echo Vending Machine Dispenser is now running in fullscreen!
echo Press F11 to exit fullscreen or Alt+F4 to close.

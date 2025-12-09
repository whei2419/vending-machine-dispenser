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
echo Services started. Opening application in kiosk mode...
timeout /t 2 /nobreak >nul

REM Try Chrome first, then Edge
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo Using Chrome...
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost/vending-machine-dispenser/index.html
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    echo Using Edge...
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --kiosk --app=http://localhost/vending-machine-dispenser/index.html
) else (
    echo Chrome or Edge not found. Opening in default browser...
    start "" "http://localhost/vending-machine-dispenser/index.html"
)

echo.
echo Vending Machine Dispenser is now running in kiosk mode!
echo Press F11 to exit fullscreen or Alt+F4 to close.

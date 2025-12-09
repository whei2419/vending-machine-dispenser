# Auto-Run Setup for Vending Machine Dispenser

## Quick Start

### Option 1: Using the Batch File
1. Double-click `start-vending-machine.bat` to start the application
2. The script will:
   - Check if Apache is running, start it if needed
   - Check if MySQL is running, start it if needed
   - Automatically open the application in your default browser

### Option 2: Windows Startup (Auto-run on Boot)

#### Method A: Startup Folder
1. Press `Win + R` to open Run dialog
2. Type `shell:startup` and press Enter
3. Create a shortcut to `start-vending-machine.bat` in the Startup folder
4. The application will now start automatically when Windows boots

#### Method B: Task Scheduler (Advanced)
1. Open Task Scheduler (search in Start menu)
2. Click "Create Basic Task"
3. Name: "Vending Machine Auto Start"
4. Trigger: "When the computer starts" or "When I log on"
5. Action: "Start a program"
6. Program: Browse to `start-vending-machine.bat`
7. Finish and test

### Option 3: Desktop Shortcut
1. Right-click on `start-vending-machine.bat`
2. Select "Send to" > "Desktop (create shortcut)"
3. Optionally rename the shortcut to "Start Vending Machine"
4. Double-click the desktop shortcut to launch

## Kiosk Mode (Full Screen)

To run in kiosk mode, create a shortcut with these targets:

**Chrome:**
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost/vending-machine-dispenser/index.html
```

**Edge:**
```
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --kiosk --app=http://localhost/vending-machine-dispenser/index.html
```

## Troubleshooting

- If Apache doesn't start, check XAMPP Control Panel manually
- Ensure XAMPP is installed at `C:\xampp\` (edit batch file if different location)
- Check Windows Firewall if the browser can't connect
- Make sure port 80 is not being used by another application

## Stopping Services

To stop XAMPP services:
1. Open XAMPP Control Panel
2. Click "Stop" for Apache and MySQL
OR
3. Use the included `stop-vending-machine.bat` file

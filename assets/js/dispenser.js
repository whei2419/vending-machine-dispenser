let checkInterval = null;

async function logErrorToServer(functionName, errorMessage) {
    try {
        await fetch('dispenser/log_error.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'function=' + encodeURIComponent(functionName) + '&error=' + encodeURIComponent(errorMessage)
        });
    } catch (e) {
        console.error('Failed to log error to server:', e);
    }
}

async function triggerDispense() {
    const statusDiv = document.getElementById('status');
    const btn = document.getElementById('dispenseBtn');
    
    // Disable button during process
    btn.disabled = true;
    btn.textContent = 'DISPENSING...';
    
    try {
        // Get current timestamp in format: YYYYMMDDHHmmss
        const now = new Date();
        const timestamp = now.getFullYear() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0') +
            String(now.getHours()).padStart(2, '0') +
            String(now.getMinutes()).padStart(2, '0') +
            String(now.getSeconds()).padStart(2, '0');
        const logEntry = `D;${timestamp}\n`;
        
        statusDiv.className = 'info';
        statusDiv.textContent = 'Sending dispense command...';
        
        // Write to ActionLog.txt
        const response = await fetch('dispenser/write_log.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=' + encodeURIComponent(logEntry)
        });
        
        if (response.ok) {
            const result = await response.text();
            statusDiv.className = 'info';
            statusDiv.textContent = '⏳ Waiting for dispenser to complete...';
            
            // Start checking for 'S' response every 5 seconds
            startCheckingForCompletion(timestamp);
        } else {
            throw new Error('Failed to write to log');
        }
        
    } catch (error) {
        statusDiv.className = 'error';
        statusDiv.textContent = '✗ Error: ' + error.message;
        btn.disabled = false;
        btn.textContent = 'DISPENSE ITEM';
        
        // Log error to server
        logErrorToServer('triggerDispense', error.message);
    }
}

async function startCheckingForCompletion(originalTimestamp) {
    const statusDiv = document.getElementById('status');
    const btn = document.getElementById('dispenseBtn');
    
    // Clear any existing interval
    if (checkInterval) {
        clearInterval(checkInterval);
    }
    
    checkInterval = setInterval(async () => {
        try {
            const response = await fetch('dispenser/check_log.php');
            const logContent = await response.text();
            
            // Check if there's an 'S' entry after our 'D' entry
            const lines = logContent.split('\n').filter(line => line.trim());
            const lastLine = lines[lines.length - 1];
            
            if (lastLine && lastLine.startsWith('S;')) {
                // Dispense completed
                clearInterval(checkInterval);
                checkInterval = null;
                
                statusDiv.className = 'success';
                statusDiv.textContent = `✓ Dispense completed at ${new Date().toLocaleTimeString()}`;
                
                btn.disabled = false;
                btn.textContent = 'DISPENSE ITEM';
            }
            
        } catch (error) {
            console.error('Error checking log:', error);
            logErrorToServer('startCheckingForCompletion', error.message);
        }
    }, 5000); // Check every 5 seconds
    
    // Set timeout to stop checking after 2 minutes
    setTimeout(() => {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
            statusDiv.className = 'error';
            statusDiv.textContent = '✗ Timeout: No response from dispenser';
            btn.disabled = false;
            btn.textContent = 'DISPENSE ITEM';
        }
    }, 120000); // 2 minutes timeout
}

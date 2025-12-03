// Dispense page script - handles dispensing after game completion
let checkInterval = null;
let isDispensing = false; // Flag to prevent multiple dispense triggers

async function logErrorToServer(functionName, errorMessage) {
    try {
        await fetch('../dispenser/log_error.php', {
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
    // Prevent multiple triggers
    if (isDispensing) {
        console.log('Dispense already in progress, ignoring duplicate trigger');
        return;
    }
    
    isDispensing = true;
    const statusDiv = document.getElementById('status');
    const progressBar = document.getElementById('progressBar');
    
    // Start progress animation
    progressBar.style.width = '10%';
    
    try {
        // Get current timestamp in format: YYYYMMDDHHmmss
        const now = new Date();
        const timestamp = now.getFullYear() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0') +
            String(now.getHours()).padStart(2, '0') +
            String(now.getMinutes()).padStart(2, '0') +
            String(now.getSeconds()).padStart(2, '0');
        
        const message = `D;${timestamp}`;
        
        // Save timestamp to session storage for reload recovery
        sessionStorage.setItem('dispenseTimestamp', timestamp);
        
        statusDiv.textContent = 'Sending dispense command...';
        progressBar.style.width = '30%';
        
        // Send dispense command
        const response = await fetch('../dispenser/write_log.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=' + encodeURIComponent(message)
        });
        
        const result = await response.text();
        
        if (result.includes('Success')) {
            statusDiv.textContent = 'Dispensing in progress...';
            progressBar.style.width = '50%';
            // Start checking for completion
            startCheckingForCompletion(timestamp);
        } else {
            throw new Error(result || 'Failed to trigger dispense');
        }
        
    } catch (error) {
        console.error('Error:', error);
        await logErrorToServer('triggerDispense', error.message);
        statusDiv.textContent = 'Error: ' + error.message;
        statusDiv.style.color = 'red';
        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = 'red';
        
        // Clear the dispense flags on error
        sessionStorage.removeItem('dispenseTriggered');
        sessionStorage.removeItem('dispenseTimestamp');
        
        // Redirect to index after error (5 seconds)
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 5000);
    }
}

function startCheckingForCompletion(timestamp) {
    const statusDiv = document.getElementById('status');
    const progressBar = document.getElementById('progressBar');
    const expectedStart = `S;${timestamp}`;
    let progress = 50;
    let dispensingStarted = false;
    
    // Gradually increase progress while waiting
    const progressInterval = setInterval(() => {
        if (!dispensingStarted && progress < 90) {
            progress += 2;
            progressBar.style.width = progress + '%';
        }
    }, 2000);
    
    checkInterval = setInterval(async () => {
        try {
            const response = await fetch('../dispenser/check_log.php?t=' + Date.now());
            const data = await response.text();
            
            // Check if dispensing has started (S entry detected)
            if (!dispensingStarted && data && data.includes(expectedStart)) {
                dispensingStarted = true;
                clearInterval(checkInterval);
                clearInterval(progressInterval);
                
                statusDiv.textContent = 'Dispensing in progress...';
                statusDiv.style.color = '#ffffff';
                
                // Animate progress bar over 30 seconds
                let dispenseProgress = 90;
                progressBar.style.width = '90%';
                
                const dispenseProgressInterval = setInterval(() => {
                    if (dispenseProgress < 100) {
                        dispenseProgress += 0.33; // Reach 100% in ~30 steps
                        progressBar.style.width = dispenseProgress + '%';
                    }
                }, 1000);
                
                // Wait 30 seconds for dispensing to complete
                setTimeout(async () => {
                    clearInterval(dispenseProgressInterval);
                    progressBar.style.width = '100%';
                    statusDiv.textContent = 'Dispense completed successfully!';
                    statusDiv.style.color = '#ffffff';
                    
                    // Clear the ActionLog.txt file
                    try {
                        const clearResponse = await fetch('../dispenser/clear_log.php', {
                            method: 'POST'
                        });
                        const clearResult = await clearResponse.text();
                        console.log('Log cleared:', clearResult);
                    } catch (error) {
                        console.error('Failed to clear log:', error);
                        await logErrorToServer('clearLog', error.message);
                    }
                    
                    // Clear the dispense flags
                    sessionStorage.removeItem('dispenseTriggered');
                    sessionStorage.removeItem('dispenseTimestamp');
                    
                    // Redirect to index page after 2 seconds
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 2000);
                }, 30000); // 30 seconds
            }
        } catch (error) {
            console.error('Error checking log:', error);
            await logErrorToServer('startCheckingForCompletion', error.message);
        }
    }, 5000); // Check every 5 seconds
    
    // Timeout after 2 minutes (if S entry never appears)
    setTimeout(() => {
        if (checkInterval && !dispensingStarted) {
            clearInterval(checkInterval);
            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            progressBar.style.background = 'orange';
            statusDiv.textContent = 'Dispense timeout - please contact support';
            statusDiv.style.color = 'orange';
            
            // Clear the dispense flags on timeout
            sessionStorage.removeItem('dispenseTriggered');
            sessionStorage.removeItem('dispenseTimestamp');
            
            // Redirect to index after timeout
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 3000);
        }
    }, 120000);
}

// Auto-trigger dispense when page loads
window.onload = function() {
    // Check if dispense has already been triggered in this session
    const dispenseTriggered = sessionStorage.getItem('dispenseTriggered');
    const dispenseTimestamp = sessionStorage.getItem('dispenseTimestamp');
    
    if (dispenseTriggered && dispenseTimestamp) {
        console.log('Dispense already triggered, continuing to check for completion');
        const statusDiv = document.getElementById('status');
        const progressBar = document.getElementById('progressBar');
        
        statusDiv.textContent = 'Checking dispense status...';
        progressBar.style.width = '70%';
        
        // Continue checking for the existing dispense completion
        startCheckingForCompletion(dispenseTimestamp);
        return;
    }
    
    // Mark dispense as triggered for this session
    sessionStorage.setItem('dispenseTriggered', 'true');
    triggerDispense();
};

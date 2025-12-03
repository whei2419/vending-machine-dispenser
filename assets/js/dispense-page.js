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
    
    // Get timestamp from URL parameter
    const params = new URLSearchParams(window.location.search);
    const timestamp = params.get('timestamp');
    
    if (!timestamp) {
        statusDiv.textContent = 'Error: No dispense timestamp found';
        statusDiv.style.color = 'red';
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 3000);
        return;
    }
    
    // Start progress animation
    progressBar.style.width = '30%';
    statusDiv.textContent = 'Waiting for dispenser to start...';
    
    // Start checking for S entry (dispense start)
    startCheckingForCompletion(timestamp);
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
                
                statusDiv.textContent = 'Your reward is falling! Please collect it...';
                statusDiv.style.color = '#ffffff';
                
                // Animate progress bar over 30 seconds
                let dispenseProgress = 90;
                progressBar.style.width = '90%';
                
                const dispenseProgressInterval = setInterval(() => {
                    if (dispenseProgress < 100) {
                        dispenseProgress += 2; // Reach 100% in ~5 steps
                        progressBar.style.width = dispenseProgress + '%';
                    }
                }, 1000);
                
                // Wait 5 seconds for dispensing to complete
                setTimeout(async () => {
                    clearInterval(dispenseProgressInterval);
                    progressBar.style.width = '100%';
                    statusDiv.textContent = 'Collection complete! Thank you!';
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
                    
                    // Redirect to index page after 2 seconds
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 2000);
                }, 5000); // 5 seconds
            }
        } catch (error) {
            console.error('Error checking log:', error);
            await logErrorToServer('startCheckingForCompletion', error.message);
        }
    }, 500); // Check every 500ms
    
    // Timeout after 2 minutes (if S entry never appears)
    setTimeout(() => {
        if (checkInterval && !dispensingStarted) {
            clearInterval(checkInterval);
            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            progressBar.style.background = 'orange';
            statusDiv.textContent = 'Dispense timeout - please contact support';
            statusDiv.style.color = 'orange';
            
            // Redirect to index after timeout
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 3000);
        }
    }, 120000);
}

// Auto-trigger dispense when page loads
window.onload = function() {
    triggerDispense();
};

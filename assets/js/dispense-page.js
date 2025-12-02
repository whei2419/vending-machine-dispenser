// Dispense page script - handles dispensing after game completion
let checkInterval = null;

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
        
        // Redirect to index after error (5 seconds)
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 5000);
    }
}

function startCheckingForCompletion(timestamp) {
    const statusDiv = document.getElementById('status');
    const progressBar = document.getElementById('progressBar');
    const expectedCompletion = `S;${timestamp}`;
    let progress = 50;
    
    // Gradually increase progress while waiting
    const progressInterval = setInterval(() => {
        if (progress < 90) {
            progress += 2;
            progressBar.style.width = progress + '%';
        }
    }, 2000);
    
    checkInterval = setInterval(async () => {
        try {
            const response = await fetch('../dispenser/check_log.php?t=' + Date.now());
            const data = await response.json();
            
            if (data.status === 'success' && data.last_entry) {
                if (data.last_entry === expectedCompletion) {
                    clearInterval(checkInterval);
                    clearInterval(progressInterval);
                    progressBar.style.width = '100%';
                    statusDiv.textContent = 'Dispense completed successfully!';
                    statusDiv.style.color = 'green';
                    
                    // Redirect to index page after 2 seconds
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 2000);
                }
            }
        } catch (error) {
            console.error('Error checking log:', error);
            await logErrorToServer('startCheckingForCompletion', error.message);
        }
    }, 5000); // Check every 5 seconds
    
    // Timeout after 2 minutes
    setTimeout(() => {
        if (checkInterval) {
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

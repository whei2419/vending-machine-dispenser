// Dispense page script - handles dispensing after game completion
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
    statusDiv.textContent = 'Your reward is dispensing...';
    
    // Animate progress bar from 0% to 100% over 10 seconds
    let progress = 0;
    progressBar.style.width = '0%';
    
    const progressInterval = setInterval(() => {
        if (progress < 100) {
            progress += 1; // Increase by 1% every 100ms = 10 seconds total
            progressBar.style.width = progress + '%';
        }
    }, 100);
    
    // After 10 seconds, clear log and redirect
    setTimeout(async () => {
        clearInterval(progressInterval);
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
        
        // Redirect to index page after 1 second
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }, 10000); // 10 seconds
}

// Auto-trigger dispense when page loads
window.onload = function() {
    triggerDispense();
};

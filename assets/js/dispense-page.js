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
    statusDiv.textContent = '';
    
    // Animate progress bar from 0% to 100% over 10 seconds
    let progress = 0;
    progressBar.style.width = '0%';
    
    const progressInterval = setInterval(() => {
        if (progress < 100) {
            progress += 1; // Increase by 1% every 100ms = 10 seconds total
            progressBar.style.width = progress + '%';
        }
    }, 100);
    
    // After 10 seconds, finish progress and redirect to index
    setTimeout(() => {
        clearInterval(progressInterval);
        progressBar.style.width = '100%';
        statusDiv.textContent = '';
        statusDiv.style.color = '#ffffff';
        
        // Redirect to index page after 2 seconds
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }, 10000); // 10 seconds
}

// Auto-trigger dispense when page loads
window.onload = function() {
    triggerDispense();
};

// Finish page script
let hoverTimer = null;
let selectedLang = '';
let isProcessing = false;

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    const score = params.get('score');
    const obj1 = params.get('obj1') || 0;
    const obj2 = params.get('obj2') || 0;
    const obj3 = params.get('obj3') || 0;

    const body = document.body;
    const startButton = document.getElementById('startButton');
    const scoreDisplay = document.getElementById('score');
    const obj1Display = document.getElementById('obj1Score');
    const obj2Display = document.getElementById('obj2Score');
    const obj3Display = document.getElementById('obj3Score');

    console.log(`Score: ${score}`);

    // Display individual scores
    obj1Display.innerText = obj1;
    obj2Display.innerText = obj2;
    obj3Display.innerText = obj3;

    if (lang === 'chinese') {
        body.style.backgroundImage = "url('../assets/ch-end.png')";
        startButton.innerText = "结束";
        selectedLang = 'chinese';
        scoreDisplay.innerText = score;
    } else {
        body.style.backgroundImage = "url('../assets/dutch/finish.webp')";
        startButton.innerText = "Finish";
        selectedLang = 'english';
        scoreDisplay.innerText = score;
    }

    function handleInteraction() {
        if (isProcessing) return;
        isProcessing = true;
        
        startButton.classList.add('loading');
        const clickSound = new Audio('../assets/audio/select-sound.mp3');
        const completeSound = new Audio('../assets/audio/completed.mp3');
        clickSound.play();
        hoverTimer = setTimeout(async function () {
            completeSound.play();
            
            // Only proceed to dispense if score is valid (player actually played the game)
            if (score && parseInt(score) >= 0) {
                // Send D entry to ActionLog before redirecting to dispense page
                try {
                    // Generate timestamp
                    const now = new Date();
                    const timestamp = now.getFullYear() +
                        String(now.getMonth() + 1).padStart(2, '0') +
                        String(now.getDate()).padStart(2, '0') +
                        String(now.getHours()).padStart(2, '0') +
                        String(now.getMinutes()).padStart(2, '0') +
                        String(now.getSeconds()).padStart(2, '0');
                    
                    const message = `D;${timestamp}`;
                    console.log('Sending D entry:', message);
                    
                    // Send D entry
                    const response = await fetch('../dispenser/write_log.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: 'action=' + encodeURIComponent(message)
                    });
                    
                    const result = await response.text();
                    console.log('Write log response:', result);
                    
                    if (result.includes('Success')) {
                        console.log('D entry written successfully, redirecting to dispense page');
                        
                        setTimeout(function () {
                            window.location.href = `dispense.html?lang=${selectedLang}&timestamp=${timestamp}`;
                        }, 500);
                    } else {
                        throw new Error('Failed to write D entry: ' + result);
                    }
                } catch (error) {
                    console.error('Error sending D entry:', error);
                    setTimeout(function () {
                        window.location.href = `../index.html?lang=${selectedLang}`;
                    }, 500);
                }
            } else {
                // Skip dispense if no valid score
                setTimeout(function () {
                    window.location.href = `../index.html?lang=${selectedLang}`;
                }, 500);
            }
        }, 1000);
    }

    startButton.addEventListener('mouseover', handleInteraction);
    startButton.addEventListener('click', handleInteraction);

    startButton.addEventListener('mouseout', function () {
        if (!isProcessing) {
            startButton.classList.remove('loading');
            clearTimeout(hoverTimer);
            isProcessing = false;
        }
    });
}

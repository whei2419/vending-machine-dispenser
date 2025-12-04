// Try Again page script
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
    const tryAgainButton = document.getElementById('tryAgainButton');
    const scoreDisplay = document.getElementById('score');
    const obj1Display = document.getElementById('obj1Score');
    const obj2Display = document.getElementById('obj2Score');
    const obj3Display = document.getElementById('obj3Score');

    console.log(`Score: ${score}`);

    // Display individual scores
    obj1Display.innerText = obj1;
    obj2Display.innerText = obj2;
    obj3Display.innerText = obj3;

    body.style.backgroundImage = "url('../assets/dutch/tryagain.webp')";
    tryAgainButton.innerText = "Try Again";
    selectedLang = 'english';
    scoreDisplay.innerText = score;

    function handleInteraction() {
        if (isProcessing) return;
        
        tryAgainButton.classList.add('loading');
        const clickSound = new Audio('../assets/audio/select-sound.mp3');
        const completeSound = new Audio('../assets/audio/completed.mp3');
        clickSound.play();
        hoverTimer = setTimeout(function () {
            isProcessing = true;
            completeSound.play();
            setTimeout(function () {
                // Redirect back to game page
                window.location.href = `game.html?lang=${selectedLang}`;
            }, 500);
        }, 1000);
    }

    tryAgainButton.addEventListener('mouseover', handleInteraction);
    tryAgainButton.addEventListener('click', handleInteraction);

    tryAgainButton.addEventListener('mouseout', function () {
        if (!isProcessing) {
            tryAgainButton.classList.remove('loading');
            clearTimeout(hoverTimer);
        }
    });
}
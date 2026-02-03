// Try Again page script
let hoverTimer = null;
let selectedLang = '';
let isProcessing = false;

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    const score = params.get('score');
    const apple = params.get('apple') || 0;
    const banana = params.get('banana') || 0;
    const carrot = params.get('carrot') || 0;
    const egg = params.get('egg') || 0;
    const milk = params.get('milk') || 0;

    const body = document.body;
    const tryAgainButton = document.getElementById('tryAgainButton');
    const scoreDisplay = document.getElementById('score');
    const appleDisplay = document.getElementById('appleScore');
    const bananaDisplay = document.getElementById('bananaScore');
    const carrotDisplay = document.getElementById('carrotScore');
    const eggDisplay = document.getElementById('eggScore');
    const milkDisplay = document.getElementById('milkScore');

    console.log(`Score: ${score}`);

    // Display individual scores for all objects
    appleDisplay.innerText = apple;
    bananaDisplay.innerText = banana;
    carrotDisplay.innerText = carrot;
    eggDisplay.innerText = egg;
    milkDisplay.innerText = milk;

    body.style.backgroundImage = "url('../assets/dutch/tryagain.webp')";
    tryAgainButton.innerText = "CUBA LAGI";
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
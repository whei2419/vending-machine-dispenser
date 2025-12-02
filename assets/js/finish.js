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
        
        startButton.classList.add('loading');
        const clickSound = new Audio('../assets/audio/select-sound.mp3');
        const completeSound = new Audio('../assets/audio/completed.mp3');
        clickSound.play();
        hoverTimer = setTimeout(function () {
            isProcessing = true;
            completeSound.play();
            setTimeout(function () {
                // Only redirect if score is valid (player actually played the game)
                if (score && parseInt(score) >= 0) {
                    window.location.href = `dispense.html?lang=${selectedLang}`;
                } else {
                    // Skip dispense if no valid score
                    window.location.href = `../index.html?lang=${selectedLang}`;
                }
            }, 500);
        }, 1000);
    }

    startButton.addEventListener('mouseover', handleInteraction);
    startButton.addEventListener('click', handleInteraction);

    startButton.addEventListener('mouseout', function () {
        if (!isProcessing) {
            startButton.classList.remove('loading');
            clearTimeout(hoverTimer);
        }
    });
}

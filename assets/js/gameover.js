// Game over page script
let hoverTimer = null;
let selectedLang = '';

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');

    const body = document.body;
    const startButton = document.getElementById('startButton');

    if (lang === 'chinese') {
        body.style.backgroundImage = "url('../assets/game-over-ch.png')";
        startButton.innerText = "再试一次";
        selectedLang = 'chinese';
    } else {
        body.style.backgroundImage = "url('../assets/game-over-en.png')";
        startButton.innerText = "Try Again";
        selectedLang = 'english';
    }

    startButton.addEventListener('mouseover', function () {
        const clickSound = new Audio('../assets/audio/select-sound.mp3');
        const completeSound = new Audio('../assets/audio/completed.mp3');
        clickSound.play();
        hoverTimer = setTimeout(function () {
            completeSound.play();
            setTimeout(function () {
                window.location.href = `start.html?lang=${selectedLang}`;
            }, 500);
        }, 1000);
    });

    startButton.addEventListener('mouseout', function () {
        clearTimeout(hoverTimer);
    });
}

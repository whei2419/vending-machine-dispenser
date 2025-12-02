// Finish page script
let hoverTimer = null;
let selectedLang = '';

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    const score = params.get('score');

    const body = document.body;
    const startButton = document.getElementById('startButton');
    const scoreDisplay = document.getElementById('score');

    console.log(`Score: ${score}`);

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
        const clickSound = new Audio('../assets/audio/select-sound.mp3');
        const completeSound = new Audio('../assets/audio/completed.mp3');
        clickSound.play();
        hoverTimer = setTimeout(function () {
            completeSound.play();
            setTimeout(function () {
                window.location.href = `../index.html?lang=${selectedLang}`;
            }, 500);
        }, 1000);
    }

    startButton.addEventListener('mouseover', handleInteraction);
    startButton.addEventListener('click', handleInteraction);

    startButton.addEventListener('mouseout', function () {
        clearTimeout(hoverTimer);
    });
}

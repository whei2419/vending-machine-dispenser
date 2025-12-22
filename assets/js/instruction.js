// Instruction page script
let hoverTimer = null;
let selectedLang = '';

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');

    const body = document.body;
    const startButton = document.getElementById('startButton');

    if (lang === 'chinese') {
        body.style.backgroundImage = "url('../assets/instructioncn.png')";
        startButton.innerText = "我们走";
        selectedLang = 'chinese';
    } else {
        body.style.backgroundImage = "url('../assets/dutch/instruction.webp')";
        startButton.innerText = "SETERUSNYA";
        selectedLang = 'english';
    }

    function handleInteraction() {
        startButton.classList.add('loading');
        const clickSound = new Audio('../assets/audio/select-sound.mp3');
        const completeSound = new Audio('../assets/audio/completed.mp3');
        clickSound.play();
        hoverTimer = setTimeout(function () {
            completeSound.play();
            setTimeout(function () {
                window.location.href = `game.html?lang=${selectedLang}`;
            }, 500);
        }, 1000);
    }

    startButton.addEventListener('mouseover', handleInteraction);
    startButton.addEventListener('click', handleInteraction);

    startButton.addEventListener('mouseout', function () {
        startButton.classList.remove('loading');
        clearTimeout(hoverTimer);
    });
}

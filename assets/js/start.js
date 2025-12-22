// Start page script
let selectedLang = '';
let hoverTimer = null;

async function clearActionLog() {
    try {
        const response = await fetch('dispenser/clear_log.php', {
            method: 'POST'
        });
        const result = await response.text();
        console.log('ActionLog cleared on start page:', result);
    } catch (error) {
        console.error('Failed to clear ActionLog:', error);
    }
}

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');

    const body = document.body;
    const startButton = document.getElementById('startButton');
    const startVideo = document.getElementById('startVideo');
    const videoContainer = document.querySelector('.video');

    // Note: Do not clear ActionLog on start to avoid removing dispenser timestamps
    // clearActionLog(); // intentionally disabled

    if (lang === 'chinese') {
        body.style.backgroundImage = "url('assets/startcn.png')";
        startButton.innerText = "开始";
        selectedLang = 'chinese';
    } else {
        body.style.backgroundImage = "url('assets/dutch/start.webp')"; 
        startButton.innerText = "MULAKAN";
        selectedLang = 'english';
    }

    function handleInteraction() {
        startButton.classList.add('loading');
        const clickSound = new Audio('assets/audio/select-sound.mp3');
        const completeSound = new Audio('assets/audio/completed.mp3');
        clickSound.play(); 
        hoverTimer = setTimeout(function () {
            completeSound.play();
            window.location.href = `pages/instruction.html?lang=${selectedLang}`;
        }, 1000); 
    }

    startButton.addEventListener('mouseover', handleInteraction);
    startButton.addEventListener('click', handleInteraction);

    startButton.addEventListener('mouseout', function () {
        startButton.classList.remove('loading');
        clearTimeout(hoverTimer);
    });
}

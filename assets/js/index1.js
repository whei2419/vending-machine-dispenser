// Language selection page script
let hoverTimer = null;

function startHover(lang) {
    const clickSound = new Audio('../assets/audio/select-sound.mp3');
    const completeSound = new Audio('../assets/audio/completed.mp3');
    clickSound.play(); 
    hoverTimer = setTimeout(function () {
        completeSound.play();
        setTimeout(function () {
            window.location.href = `start.html?lang=${lang}`;
        }, 500);
    }, 1000); 
}

function cancelHover() {
    clearTimeout(hoverTimer);
}

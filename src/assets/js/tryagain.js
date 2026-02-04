// Try Again page script
let hoverTimer = null;
let selectedLang = "";
let isProcessing = false;

window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");
  const score = params.get("score");
  const apple = params.get("apple") || 0;
  const banana = params.get("banana") || 0;
  const carrot = params.get("carrot") || 0;

  const body = document.body;
  const tryAgainButton = document.getElementById("tryAgainButton");
  const scoreDisplay = document.getElementById("score");
  const appleDisplay = document.getElementById("magnifyScore");
  const bananaDisplay = document.getElementById("octagonScore");
  const carrotDisplay = document.getElementById("worldScore");

  console.log(`Score: ${score}`);

  // Display individual scores for objects that remain
  appleDisplay.innerText = apple;
  bananaDisplay.innerText = banana;
  carrotDisplay.innerText = carrot;

  body.style.backgroundImage = "url('../assets/dutch/tryagain.webp')";
  tryAgainButton.innerText = "CUBA LAGI";
  selectedLang = "english";
  scoreDisplay.innerText = score;

  function handleInteraction() {
    if (isProcessing) return;

    tryAgainButton.classList.add("loading");
    const clickSound = new Audio("../assets/audio/select-sound.mp3");
    const completeSound = new Audio("../assets/audio/completed.mp3");
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

  tryAgainButton.addEventListener("mouseover", handleInteraction);
  tryAgainButton.addEventListener("click", handleInteraction);

  tryAgainButton.addEventListener("mouseout", function () {
    if (!isProcessing) {
      tryAgainButton.classList.remove("loading");
      clearTimeout(hoverTimer);
    }
  });
};

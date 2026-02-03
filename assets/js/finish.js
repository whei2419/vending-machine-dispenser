// Finish page script
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
  const egg = params.get("egg") || 0;
  const milk = params.get("milk") || 0;

  const body = document.body;
  const startButton = document.getElementById("startButton");
  const scoreDisplay = document.getElementById("score");
  const appleDisplay = document.getElementById("appleScore");
  const bananaDisplay = document.getElementById("bananaScore");
  const carrotDisplay = document.getElementById("carrotScore");
  const eggDisplay = document.getElementById("eggScore");
  const milkDisplay = document.getElementById("milkScore");

  console.log(`Score: ${score}`);

  // Display individual scores for all objects
  appleDisplay.innerText = apple;
  bananaDisplay.innerText = banana;
  carrotDisplay.innerText = carrot;
  eggDisplay.innerText = egg;
  milkDisplay.innerText = milk;

  if (lang === "chinese") {
    body.style.backgroundImage = "url('../assets/ch-end.png')";
    startButton.innerText = "结束";
    selectedLang = "chinese";
    scoreDisplay.innerText = score;
  } else {
    body.style.backgroundImage = "url('../assets/dutch/finish.webp')";
    startButton.innerText = "SELESAI";
    selectedLang = "english";
    scoreDisplay.innerText = score;
  }

  function handleInteraction() {
    if (isProcessing) return;
    isProcessing = true;

    startButton.classList.add("loading");
    const clickSound = new Audio("../assets/audio/select-sound.mp3");
    const completeSound = new Audio("../assets/audio/completed.mp3");
    clickSound.play();
    hoverTimer = setTimeout(function () {
      completeSound.play();

      // Redirect back to index page
      setTimeout(function () {
        window.location.href = `../index.html?lang=${selectedLang}`;
      }, 500);
    }, 1000);
  }

  startButton.addEventListener("mouseover", handleInteraction);
  startButton.addEventListener("click", handleInteraction);

  startButton.addEventListener("mouseout", function () {
    if (!isProcessing) {
      startButton.classList.remove("loading");
      clearTimeout(hoverTimer);
      isProcessing = false;
    }
  });
};

let score = 0;
let timeLeft = 30;
let timerInterval;
let dropInterval;
let fallSpeed = 3;
let dropFrequency = 800;
let winScore = 15; // Default for 'Normal'
let milestones = [Math.floor(winScore/2), winScore - 2];
let milestoneMessages = ["Halfway there!", "Almost done!"];
let milestoneIndex = 0;

const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const messageDisplay = document.getElementById("message");
const resetButton = document.getElementById("resetButton");
const difficultySelect = document.getElementById("difficulty");

// (Optional) Sound effects
// const sfxGood = document.getElementById('sfx-good');
// const sfxBad = document.getElementById('sfx-bad');

function setDifficultySettings() {
  const diff = difficultySelect.value;
  if (diff === "easy") {
    timeLeft = 40;
    fallSpeed = 2.2;
    dropFrequency = 1100;
    winScore = 12;
  } else if (diff === "normal") {
    timeLeft = 30;
    fallSpeed = 3;
    dropFrequency = 800;
    winScore = 15;
  } else if (diff === "hard") {
    timeLeft = 20;
    fallSpeed = 5;
    dropFrequency = 550;
    winScore = 22;
  }
  // Update milestone settings
  milestones = [Math.floor(winScore/2), winScore - 2];
  milestoneIndex = 0;
}

function startGame() {
  setDifficultySettings();
  score = 0;
  updateScore();
  updateTimerDisplay();
  messageDisplay.textContent = "";
  gameArea.innerHTML = "";

  // Start timer
  timerInterval = setInterval(updateTimer, 1000);

  // Create drops at interval
  dropInterval = setInterval(createDrop, dropFrequency);
}

function updateTimer() {
  timeLeft--;
  updateTimerDisplay();
  if (timeLeft === 0) {
    endGame();
  }
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
  // Show milestone messages
  if (milestoneIndex < milestones.length && score >= milestones[milestoneIndex]) {
    showMessage(milestoneMessages[milestoneIndex]);
    milestoneIndex++;
  }
}

function updateTimerDisplay() {
  timerDisplay.textContent = `Timer: ${timeLeft}`;
}

function createDrop() {
  const drop = document.createElement("div");
  const isBad = Math.random() < 0.25; // 25% bad drops for variety
  drop.classList.add("drop");
  drop.textContent = isBad ? "💩" : "💧";
  drop.style.left = `${Math.random() * 90}%`;
  drop.style.top = "0px";
  gameArea.appendChild(drop);

  // Drop falling
  let top = 0;
  const speed = fallSpeed + Math.random() * 1.2;
  const fall = setInterval(() => {
    top += speed;
    drop.style.top = `${top}px`;
    if (top > gameArea.clientHeight) {
      clearInterval(fall);
      if (gameArea.contains(drop)) {
        gameArea.removeChild(drop);
      }
    }
  }, 20);

  // Click event
  drop.addEventListener("click", () => {
    clearInterval(fall);
    if (gameArea.contains(drop)) {
      gameArea.removeChild(drop);
    }
    if (isBad) {
      score--;
      // sfxBad?.play(); // Uncomment when using sound
      showMessage("Oops! That was dirty water.");
    } else {
      score++;
      // sfxGood?.play(); // Uncomment when using sound
      showMessage("Clean water collected!");
    }
    updateScore();
    // Win if score meets winScore before timer ends
    if (score >= winScore) {
      endGame(true);
    }
  });
}

function showMessage(text) {
  messageDisplay.textContent = text;
  setTimeout(() => {
    messageDisplay.textContent = "";
  }, 1500);
}

function endGame(won = false) {
  clearInterval(timerInterval);
  clearInterval(dropInterval);
  // Remove all drops from the area
  const drops = document.querySelectorAll(".drop");
  drops.forEach((d) => d.remove());
  if (won || score >= winScore) {
    showMessage("🎉 You collected enough clean water and helped build a well! 🎉");
    if (typeof confetti === "function") {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  } else {
    showMessage("Game Over! Try again to collect more clean water.");
  }
}

resetButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  clearInterval(dropInterval);
  startGame();
});

difficultySelect.addEventListener("change", () => {
  clearInterval(timerInterval);
  clearInterval(dropInterval);
  startGame();
});

// Auto start game
startGame();

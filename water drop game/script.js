let score = 0;
let timeLeft = 30;
let timerInterval;
let dropInterval;
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const messageDisplay = document.getElementById("message");
const resetButton = document.getElementById("resetButton");

function startGame() {
  score = 0;
  timeLeft = 30;
  updateScore();
  updateTimerDisplay();
  messageDisplay.textContent = "";
  gameArea.innerHTML = "";

  // Start timer
  timerInterval = setInterval(updateTimer, 1000);

  // Create drops every 800ms
  dropInterval = setInterval(createDrop, 800);
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
}

function updateTimerDisplay() {
  timerDisplay.textContent = `Timer: ${timeLeft}`;
}

function createDrop() {
  const drop = document.createElement("div");
  const isBad = Math.random() < 0.3; // 30% chance it's a bad drop
  drop.classList.add("drop");
  drop.textContent = isBad ? "💩" : "💧";
  drop.style.left = `${Math.random() * 90}%`;
  drop.style.top = "0px";

  gameArea.appendChild(drop);

  // Move drop down
  let top = 0;
  const fallSpeed = 2 + Math.random() * 3;
  const fall = setInterval(() => {
    top += fallSpeed;
    drop.style.top = `${top}px`;

    if (top > gameArea.clientHeight) {
      clearInterval(fall);
      gameArea.removeChild(drop);
    }
  }, 20);

  // Click behavior
  drop.addEventListener("click", () => {
    clearInterval(fall);
    gameArea.removeChild(drop);
    if (isBad) {
      score--;
      showMessage("Oops! That was dirty water.");
    } else {
      score++;
      showMessage("Clean water collected!");
    }
    updateScore();
  });
}

function showMessage(text) {
  messageDisplay.textContent = text;
  setTimeout(() => {
    messageDisplay.textContent = "";
  }, 1500);
}

function endGame() {
  clearInterval(timerInterval);
  clearInterval(dropInterval);
  showMessage("🎉 You collected clean water and helped build a well! 🎉");

  // Win Confetti Celebration
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  // Optional: disable game area
  const drops = document.querySelectorAll(".drop");
  drops.forEach((d) => d.remove());
}

resetButton.addEventListener("click", startGame);

// Auto start
startGame();
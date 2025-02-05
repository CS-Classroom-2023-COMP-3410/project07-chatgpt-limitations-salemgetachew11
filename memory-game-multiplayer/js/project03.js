const gameGrid = document.getElementById("gameGrid");
const moveCounter = document.getElementById("moveCounter");
const timer = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const startGameBtn = document.getElementById("startGameBtn");
const gridRowsInput = document.getElementById("gridRows");
const gridColsInput = document.getElementById("gridCols");
const welcomeContainer = document.querySelector(".welcome-container");
const gameContainer = document.querySelector(".game-container");

let cards = [];
let flippedCards = [];
let moves = 0;
let timerInterval = null;
let timeElapsed = 0;
let gridRows = 4;
let gridCols = 4;

// List of animal image filenames
const animalImages = [
  "cat.png", "dog.png", "elephant.png", "fox.png", "lion.png",
  "monkey.png", "panda.png", "rabbit.png", "tiger.png", "zebra.png"
];

startGameBtn.addEventListener("click", () => {
  gridRows = parseInt(gridRowsInput.value);
  gridCols = parseInt(gridColsInput.value);
  const totalCards = gridRows * gridCols;

  if (
    gridRows >= 2 && gridRows <= 10 &&
    gridCols >= 2 && gridCols <= 10 &&
    totalCards % 2 === 0
  ) {
    welcomeContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    initializeGame();
  } else {
    alert("Invalid grid size! Ensure the total number of cards is even and values are between 2 and 10.");
  }
});

function initializeGame() {
  const totalCards = gridRows * gridCols;
  const uniquePairs = totalCards / 2;

  // Select images, cycling if needed
  const selectedImages = [];
  for (let i = 0; i < uniquePairs; i++) {
    selectedImages.push(animalImages[i % animalImages.length]);
  }

  const cardPairs = [...selectedImages, ...selectedImages];
  cards = shuffleArray(cardPairs);
  createGrid();
  resetGameInfo();
  startTimer(); // ✅ Fix: Ensure the timer starts when the game begins
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createGrid() {
  gameGrid.innerHTML = "";
  gameGrid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;

  cards.forEach((image) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.symbol = image; // Using image filename for matching
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back"><img src="images/${image}" alt="Animal"></div>
      </div>
    `;
    card.addEventListener("click", handleCardClick);
    gameGrid.appendChild(card);
  });
}

function handleCardClick(e) {
  const clickedCard = e.currentTarget;

  if (
    clickedCard.classList.contains("flipped") ||
    clickedCard.classList.contains("matched") ||
    flippedCards.length === 2
  ) {
    return;
  }

  flippedCards.push(clickedCard);
  clickedCard.classList.add("flipped");

  if (flippedCards.length === 2) {
    moves++;
    moveCounter.textContent = moves;
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;

  // Compare image filenames instead of unique symbols
  if (card1.dataset.symbol === card2.dataset.symbol) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    flippedCards = [];
    
    // Check if all cards are matched
    if (document.querySelectorAll(".card.matched").length === cards.length) {
      clearInterval(timerInterval);
      alert(`Game completed in ${moves} moves and ${formatTime(timeElapsed)}!`);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 1000);
  }
}

function startTimer() {
  timeElapsed = 0;
  clearInterval(timerInterval); // ✅ Fix: Ensure previous timer is cleared
  timerInterval = setInterval(() => {
    timeElapsed++;
    timer.textContent = formatTime(timeElapsed);
  }, 1000);
}

function formatTime(seconds) {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
}

function resetGameInfo() {
  moves = 0;
  moveCounter.textContent = moves;
  clearInterval(timerInterval); // ✅ Fix: Clear timer on game reset
  timer.textContent = "00:00";
}

restartBtn.addEventListener("click", () => {
  gameContainer.classList.add("hidden");
  welcomeContainer.classList.remove("hidden");
  clearInterval(timerInterval); // ✅ Fix: Clear the timer on restart
  resetGameInfo();
});
let currentPlayer = 1;
let playerScores = { 1: 0, 2: 0 };

// Initialize game elements and attach event listeners
function setupGame() {
  document.getElementById('restartBtn').addEventListener('click', resetGameInfo);
  document.getElementById('startGameBtn').addEventListener('click', startGame);
}

// Function to switch the current player after a turn
function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  document.getElementById("currentPlayer").textContent = `Player ${currentPlayer}`;
}

// Function to update the score for the current player
function updateScore() {
  playerScores[currentPlayer]++;
  document.getElementById(`player${currentPlayer}Score`).textContent = playerScores[currentPlayer];
}

// Function to handle card clicks
function handleCardClick(e) {
  const clickedCard = e.currentTarget;
  if (clickedCard.classList.contains("flipped") || flippedCards.length === 2) {
    return;  // Prevent further action if two cards are already flipped
  }

  clickedCard.classList.add("flipped");
  flippedCards.push(clickedCard);

  if (flippedCards.length === 2) {
    updateMoveCounter();
    setTimeout(checkForMatch, 1000);
  }
}

// Function to check for a match
function checkForMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.symbol === card2.dataset.symbol) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    updateScore();  // Update the score if there's a match
  } else {
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
  }

  flippedCards = [];
  switchPlayer();
  checkGameOver();
}

// Function to update the moves counter
function updateMoveCounter() {
  moves++;
  document.getElementById('moveCounter').textContent = moves;
}

// Function to check if all cards are matched
function checkGameOver() {
  if (document.querySelectorAll('.card.matched').length === cards.length) {
    alert(`Game completed! Player 1: ${playerScores[1]}, Player 2: ${playerScores[2]}`);
    clearInterval(timerInterval);
  }
}

// Function to reset the game
function resetGameInfo() {
  [...document.querySelectorAll('.card')].forEach(card => {
    card.classList.remove('flipped', 'matched');
  });

  moves = 0;
  document.getElementById('moveCounter').textContent = '0';
  playerScores = { 1: 0, 2: 0 };
  document.getElementById('player1Score').textContent = '0';
  document.getElementById('player2Score').textContent = '0';
  switchPlayer();  // Reset the turn to Player 1
  clearInterval(timerInterval);
  timer.textContent = "00:00";
}

// Call setupGame to initialize event listeners when the page loads
setupGame();

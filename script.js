// script.js
const gridContainer = document.querySelector(".grid-container");
const restartButton = document.getElementById("restart-btn");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const popupRestartButton = document.getElementById("popup-restart");
const timerElement = document.getElementById("timer");
const movesElement = document.getElementById("moves");

const cards = [
    "🍎", "🍎",
    "🍌", "🍌",
    "🍇", "🍇",
    "🍓", "🍓",
    "🍍", "🍍",
    "🥭", "🥭",
    "🍒", "🍒",
    "🍑", "🍑"
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let moves = 0;
let timer = null;
let secondsElapsed = 0;
let timerStarted = false;

// Shuffle cards
function shuffleCards() {
    return cards.sort(() => Math.random() - 0.5);
}

// Create game board
function createBoard() {
    const shuffledCards = shuffleCards();
    gridContainer.innerHTML = ""; // Clear existing cards

    shuffledCards.forEach((symbol) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${symbol}</div>
      </div>
    `;
        card.addEventListener("click", flipCard);
        gridContainer.appendChild(card);
    });
}

// Timer logic
function startTimer() {
    if (timerStarted) return; // Prevent starting the timer multiple times
    timerStarted = true;

    timer = setInterval(() => {
        secondsElapsed++;
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed % 60;
        timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }, 1000);
}

// Stop the timer
function stopTimer() {
    clearInterval(timer);
}

// Flip a card
function flipCard() {
    if (!timerStarted) {
        startTimer(); // Start the timer when the first card is clicked
    }

    if (lockBoard || this === firstCard || this.classList.contains("matched")) return;

    this.classList.add("flipped");

    if (!firstCard) {
        // First card flipped
        firstCard = this;
    } else {
        // Second card flipped
        secondCard = this;
        checkForMatch();
        updateMoves(); // Increment move counter
    }
}

// Check if two cards match
function checkForMatch() {
    const isMatch =
        firstCard.querySelector(".card-back").textContent ===
        secondCard.querySelector(".card-back").textContent;

    if (isMatch) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedPairs++;
        resetCards();
        if (matchedPairs === cards.length / 2) {
            gameOver();
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetCards();
        }, 1000);
    }
}

// Game Over Logic
function gameOver() {
    stopTimer();
    popupMessage.textContent = `You matched all cards in ${secondsElapsed} seconds and ${moves} moves!`;
    popup.classList.remove("hidden");
}

// Reset card tracking variables
function resetCards() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Update move counter
function updateMoves() {
    moves++;
    movesElement.textContent = moves;
}

// Restart the game
function restartGame() {
    matchedPairs = 0;
    moves = 0;
    timerStarted = false;
    secondsElapsed = 0;
    clearInterval(timer);
    movesElement.textContent = 0;
    timerElement.textContent = "00:00";
    popup.classList.add("hidden"); // Hide the popup if visible
    createBoard();
}

// Initialize game
restartButton.addEventListener("click", restartGame);
popupRestartButton.addEventListener("click", restartGame);
createBoard();

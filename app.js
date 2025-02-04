let board = [];
let playerPosition;
let isDead;
let hasWon;
let scrollInProgress = false;
const winSound = new Audio("./sounds/winSound.mp3");
const loseSound = new Audio("./sounds/loseSound.mp3");
const backgroundMusic = new Audio("./sounds/backgroundMusic.mp3");
const playBtnElement = document.querySelector("#play");
const boardDisplayElement = document.querySelector(".board");
const instructionsElement = document.querySelector("#insructions");

// Function to update the board and display values

function init() {
    board = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ];
    isDead = false;
    hasWon = false;
    playerPosition = { row: 0, col: 2 };
    playBackgroundMusic();
}

function startGame() {
    boardDisplayElement.style.display = "flex";
    playBtnElement.style.display = "none";
    instructionsElement.style.display = "none";

    init();
    updateBoard();
    setInterval(scrollHazards, 500);
}

// Update the board to render the 🚗 hazard
// Update the board to render the 🚗 hazard and synchronize with player
function updateBoard() {
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const square = document.getElementById(
                `h${rowIndex * 5 + (colIndex + 1)}`
            );

            // Check if there's a hazard in the current cell
            if (cell === 1) {
                if (rowIndex === 1 || rowIndex === 3 || rowIndex === 5) {
                    square.textContent = "🚗"; // Hazard is a car moving left
                    square.classList.add("hazardLeft");
                    square.classList.remove("hazardRight");
                } else {
                    square.textContent = "🚶‍➡️"; // Hazard is a pedestrian moving right
                    square.classList.add("hazardRight");
                    square.classList.remove("hazardLeft");
                }
            } else {
                square.textContent = "";
                square.classList.remove("hazardLeft");
                square.classList.remove("hazardRight");
            }

            // Check if the player is in the current cell
            if (playerPosition.row === rowIndex && playerPosition.col === colIndex) {
                square.textContent = "📃"; // Player represented as paper
            }
        });
    });

    // Check for any collisions
    hazardCollision();
    checkWin();
}

function checkWin() {
    if (playerPosition.row === 6 && !hasWon) {
        hasWon = true;
        console.log("Player Wins");
        winSound.currentTime = 0.9;
        winSound.play();
    }
}
function hazardCollision() {
    // Check if there’s a hazard where the player is standing
    if (board[playerPosition.row][playerPosition.col] === 1) {
        isDead = true;  // Player is dead
        console.log("Player Dead");
        loseSound.currentTime = 0.6;
        loseSound.play();
        // Reset player position (optional: could add a restart screen here)
        playerPosition.row = 0;
        playerPosition.col = 2;
        updateBoard();  // Re-render board with new player position
    }
}


// Scroll hazards by shifting rows left or right
function scrollHazards() {
    // For hazards moving left (rows 1, 3, 5)
    [1, 3, 5].forEach((rowIndex) => {
        let row = board[rowIndex]; // Get the row based on rowIndex
        row.pop(); // Remove the last element from the row
        row.unshift(Math.floor(Math.random() * 2)); // Insert a random 0 or 1 at the beginning
    });

    // For hazards moving right (rows 2, 4)
    [2, 4].forEach((rowIndex) => {
        let row = board[rowIndex];
        row.shift(); // Remove the first element from the row
        row.push(Math.floor(Math.random() * 2)); // Add a random 0 or 1 at the end of the row
    });

    updateBoard(); // Re-render the board after scrolling hazards
}


function movePlayer(event) {
    switch (event.key) {
        case "ArrowLeft":
            if (playerPosition.col < 4) {
                // console.log("left");
                playerPosition.col++;
                updateBoard();
            }
            break;
        case "ArrowRight":
            if (playerPosition.col > 0) {
                playerPosition.col--;
                updateBoard();
                // console.log("Right");
            }
            break;
        case "ArrowUp":
            if (playerPosition.row < 6) {
                // console.log("Up");
                playerPosition.row++;
                updateBoard();
            }
            break;
        case "ArrowDown":
            if (playerPosition.row > 0) {
                // console.log("Down");
                playerPosition.row--;
                updateBoard();
            }
            break;
    }
}
function playBackgroundMusic() {
    backgroundMusic.volume = 0.02;
    backgroundMusic.play();
}
document.addEventListener("keydown", movePlayer);
document.querySelector("#play").addEventListener("click", startGame);

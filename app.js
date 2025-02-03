let board = [];
let playerPosition = { row: 0, col: 2 };
let isDead;
let hasWon;
const winSound = new Audio("./sounds/winSound.mp3");
const loseSound = new Audio("./sounds/loseSound.mp3");
const playBtnElement = document.querySelector("#play");
const boardDisplayElement = document.querySelector(".board");
const instructionsElement = document.querySelector("#insructions")
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
}

function startGame() {
    boardDisplayElement.style.display = "flex";
    playBtnElement.style.display = "none";
    instructionsElement.style.display = "none";
    console.log(instructionsElement);
    init();
    updateBoard();
    setInterval(scrollHazards, 500);
}

function updateBoard() {
    // Loop through each row
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            // Create the ID based on row and column (rowIndex starts from 0)
            const square = document.getElementById(
                `h${rowIndex * 5 + (colIndex + 1)}`
            );

            // Display the value of the cell (1 or 0) inside the square div
            square.textContent = cell; // Show 1 or 0 in the square
            if (cell === 1) {
                if (rowIndex === 1 || rowIndex === 3 || rowIndex === 5) {
                    square.textContent = "🚗";
                    square.style.backgroundColor = "red"; // Set background to red if the value is 1
                } else {
                    square.textContent = "🚶‍➡️";
                    square.style.backgroundColor = "orange";
                }
            } else {
                square.style.backgroundColor = "transparent"; // Set background to white if the value is 0
                square.textContent = "";
            }
            if (
                playerPosition.row === rowIndex &&
                playerPosition.col === colIndex
            ) {
                square.textContent = "📃";
                square.style.backgroundColor = "lightblue";
            }
        });
    });
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
    if (board[playerPosition.row][playerPosition.col] === 1) {
        isDead = true;
        console.log("Player Dead");
        loseSound.currentTime = 0.6;
        loseSound.play();
        playerPosition.row = 0;
        playerPosition.col = 2;
        updateBoard();
    }
}
function scrollHazards() {
    // Apply the logic only to board[0], board[2], and board[4]
    [1, 3, 5].forEach((rowIndex) => {
        let row = board[rowIndex]; // Get the row based on rowIndex

        // Pop the last value and unshift a random 0 or 1 at the start of the row
        row.pop(); // Remove the last element in the row
        row.unshift(Math.floor(Math.random() * 2)); // Insert a random 0 or 1 at the beginning
    });

    [2, 4].forEach((rowIndex) => {
        row = board[rowIndex]; // Get the row based on rowIndex
        row.shift(); // Remove the first element
        row.push(Math.floor(Math.random() * 2));
    });

    updateBoard();
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
document.addEventListener("keydown", movePlayer);
document.querySelector("#play").addEventListener("click", startGame);

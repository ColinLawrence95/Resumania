let board = [
    [0, 0, 0, 0, 0],
    Array.from({ length: 5 }, () => Math.floor(Math.random() * 2)),
    Array.from({ length: 5 }, () => Math.floor(Math.random() * 2)),
    Array.from({ length: 5 }, () => Math.floor(Math.random() * 2)),
    Array.from({ length: 5 }, () => Math.floor(Math.random() * 2)),
    Array.from({ length: 5 }, () => Math.floor(Math.random() * 2)),
    [0, 0, 0, 0, 0],
];
let playerPosition = { row: 0, col: 2 };
let isDead = false;
let hasWon = false;
// Function to update the board and display values
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
                square.style.backgroundColor = "red"; // Set background to red if the value is 1
            } else {
                square.style.backgroundColor = "white"; // Set background to white if the value is 0
            }
            if (
                playerPosition.row === rowIndex &&
                playerPosition.col === colIndex
            ) {
                square.textContent = "P";
            }
        });
    });
    hazardCollision();
    checkWin();
}
function checkWin() {
    if (playerPosition.row === 6) {
        hasWon = true;
        console.log("Player Wins");
    }
}
function hazardCollision() {
    if (board[playerPosition.row][playerPosition.col] === 1) {
        isDead = true;
        console.log("Player Dead");
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

setInterval(scrollHazards, 1000);

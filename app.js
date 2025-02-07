let board = [];
let playerPosition;
let isDead;
let hasWon;
let scrollInProgress = false;
let firstPlaythrough = true;
let scrollSpeed = 20;
let difficulty = 60;
let lives;
let level;
let decideHazard;
const backgroundMusic = new Audio("./sounds/backgroundMusic.mp3");
const winSound = new Audio("./sounds/winSound.mp3");
const hitSound = new Audio("./sounds/hitSound.wav");
const moveSound = new Audio("./sounds/moveSound.wav");
const playSound = new Audio("./sounds/playSound.wav");
const playBtnElement = document.querySelector("#play");
const boardDisplayElement = document.querySelector(".board");
const instructionsElement = document.querySelector("#instructions");
const titleElement = document.querySelector("#title-text");
const playAgainElement = document.querySelector("#restart");
const livesElement = document.querySelector("#live-count");
const levelElement = document.querySelector("#level-count");
const containerElement = document.querySelector(".container");
const playerSprite = document.createElement("img");

/**
 * Initalizing game values tto there starting position
 */
function init() {
    board = [
        new Array(100).fill(0),
        new Array(100).fill(0),
        new Array(100).fill(0),
        new Array(100).fill(0),
        new Array(100).fill(0),
        new Array(100).fill(0),
        new Array(100).fill(0),
    ];
    isDead = false;
    hasWon = false;
    lives = 3;
    level = 1;
    containerElement.style.animation = "";
    playerPosition = { row: 6, col: 50 };
    if (firstPlaythrough) {
        createBoard();
        playBackgroundMusic();
        firstPlaythrough = false;
    }
    playPlaySound();
}
/**
 * Displaying board and hiding Instruction values
 */
function startGame() {
    boardDisplayElement.style.display = "flex";
    playBtnElement.style.display = "none";
    instructionsElement.style.display = "none";
    init();
    setInterval(scrollHazards, scrollSpeed);
}
/**
 * Checking if player had made it to the end and hasn't already won
 */
function checkWin() {
    if (playerPosition.row === 0 && !hasWon) {
        hasWon = true;
        level++;
        playerPosition = { row: 6, col: 50 };
        difficulty = difficulty - 2;
        hasWon = false;
    }
}
/**
 * Checking if a hazard hits the player
 */
function hazardCollision() {
    // Check if there’s a hazard within 5 horizontal grid spaces
    for (let offset = -7; offset <= 7; offset++) {
        if (offset === 0) continue;

        // Calculate the column to check (current column + offset)
        const checkCol = playerPosition.col + offset;

        // Make sure the check is within the valid board boundaries
        if (checkCol >= 0 && checkCol < board[0].length) {
            // Check if there's a hazard in this position
            if (
                board[playerPosition.row][checkCol] === 1 ||
                board[playerPosition.row][checkCol] === 2 ||
                board[playerPosition.row][checkCol] === 3
            ) {
                //kill player
                lives--;
                console.log(lives);
                playHitSound();
                playerPosition.row = 6;
                playerPosition.col = 50;
                //game over
                if (lives === 0) {
                    isDead = true;
                    containerElement.style.animation =
                        "1s lose linear infinite";
                }
                return;
            }
        }
    }
}
/**
 * pushes shifts unshifts and pops values into the hazard rows in alternating directions
 */
function scrollHazards() {
    // For hazards moving left (rows 1, 3, 5)
    [1, 3, 5].forEach((rowIndex) => {
        // Get the row based on rowIndex
        let row = board[rowIndex];
        // Remove the last element from the row
        row.pop();
        //1 in diffiulty's value chance to be a hazard
        row.unshift(Math.floor(Math.random() * difficulty * 3));
    });

    // For hazards moving right (rows 2, 4)
    [2, 4].forEach((rowIndex) => {
        // Get the row based on rowIndex
        let row = board[rowIndex];
        // Remove the first element from the row
        row.shift();
        //1 in diffiulty's value chance to be a hazard
        row.push(Math.floor(Math.random() * difficulty * 3));
    });
    updateBoard();
}
/**
 * Controls player movement and limits movement to existt within the board.
 * @param {keyDown} event
 */
function movePlayer(event) {
    //locks movement if in final row
    if (!isDead) {
        switch (event.key) {
            //move left
            case "a":
                if (playerPosition.col > 10) {
                    playerPosition.col = playerPosition.col - 20;

                    playMoveSound();
                }
                break;
            //move right
            case "d":
                if (playerPosition.col < 80) {
                    playerPosition.col = playerPosition.col + 20;
                    playMoveSound();
                }
                break;
            //move up
            case "w":
                if (playerPosition.row <= 6) {
                    playerPosition.row--;
                    playMoveSound();
                }
                break;
            //move down
            case "s":
                if (playerPosition.row < 6) {
                    playerPosition.row++;
                    playMoveSound();
                }
                break;
        }
    }
    //resets game
    if (event.key === "r" && isDead) {
        init();
    }
}
/**
 * Plays background music for game
 */
function playBackgroundMusic() {
    backgroundMusic.volume = 0.02;
    backgroundMusic.play();
}
/**
 * plays sound on player move
 */
function playMoveSound() {
    moveSound.currentTime = 0;
    moveSound.volume = 0.2;
    moveSound.play();
}
function playHitSound() {
    hitSound.currentTime = 0;
    hitSound.volume = 0.1;
    hitSound.play();
}
/**
 * plays "playSound"
 */
function playPlaySound() {
    playSound.currentTime = 0;
    playSound.volume = 0.2;
    playSound.play();
}
/**
 * Changes title value if player wins
 */
function displayTitle() {
    if (hasWon) {
        titleElement.textContent = "WINNER!";
    } else if (isDead) {
        titleElement.textContent = "UNEMPLOYED!";
    } else {
        titleElement.textContent = "RESUMANIA";
    }
}
function updateHud() {
    livesElement.textContent = `Applications Left: ${lives}`;
    levelElement.textContent = `Interview #${level}`;
}
/**
 * Dynamically creates the board
 */
function createBoard() {
    for (let rowIndex = 0; rowIndex < 7; rowIndex++) {
        for (let colIndex = 0; colIndex < 100; colIndex++) {
            const square = document.createElement("div");
            square.classList.add("sqr");
            square.id = `h${rowIndex * 100 + colIndex}`;
            boardDisplayElement.appendChild(square);
        }
    }
}
/**
 * Displaying content on the board in the grid squares
 */
function updateBoard() {
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const square = document.getElementById(
                `h${rowIndex * 100 + colIndex}`
            );
            // Check if there's a hazard in the current cell and displaying hazard sprite
            if (cell === 1) {
                const hazardRejectLetter = document.createElement("img");
                hazardRejectLetter.src = "./images/hazardRejectLetter.png";
                hazardRejectLetter.alt = "Rejection Letter";
                square.appendChild(hazardRejectLetter);
            } else if (cell === 2) {
                const hazardSpamFilter = document.createElement("img");
                hazardSpamFilter.src = "./images/hazardSpamFilter.png";
                hazardSpamFilter.alt = "Spam Filter";
                square.appendChild(hazardSpamFilter);
            } else if (cell === 3) {
                const hazardATSBot = document.createElement("img");
                hazardATSBot.src = "./images/hazardATSBot.png";
                hazardATSBot.alt = "ATS Bot";
                square.appendChild(hazardATSBot);
            } else {
                square.textContent = "";
            }
            // Check if the player is in the current cell
            if (
                playerPosition.row === rowIndex &&
                playerPosition.col === colIndex
            ) {
                //if it is change the content to player sprite
                playerSprite.src = "./images/playerSprite.png";
                playerSprite.alt = "Player";
                square.appendChild(playerSprite);
                playerSprite.classList.add("player");
            }
        });
    });
    hazardCollision();
    checkWin();
    updateHud();
    displayTitle();
}
document.addEventListener("keydown", movePlayer);
document.querySelector("#play").addEventListener("click", startGame);
backgroundMusic.addEventListener("ended", backgroundMusic);

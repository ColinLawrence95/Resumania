//hazard varibles
let scrollInProgress = false;
let scrollInterval;
let baseSpeed;
let scrollSpeed;
let loseScreenSpeed = 1;
let spawnRate;
let atsBotId = 3;
let spamFilterId = 2;
let rejectionLetterId = 1;
let oddRow = [1,3,5];
let evenRow = [2,4];
let totalUniqueHazards = 3;

//player varibles
let playerPosition;
let isDead;
let hasWon;
let lives;
let firstPlaythrough = true;
let spawnLocation = {row: 6, col: 50};

//level varibles
let board;
let level;
let boardHeight = 7
let boardWidth = 100;
let totalLevels = 10;
//sounds
let moveSoundVolume = 0.5;
let backgroundVolume = 0.02;
let hitSoundVolume = 0.05;
let stageEndSoundVolume = 0.05;
let playSoundVolume = 0.5;
let winJuiceVolume = 0.5;

//cashed element refernces
const backgroundMusic = new Audio("./sounds/backgroundMusic.mp3");
const winSound1 = new Audio("./sounds/winSound1.mp3");
const winSound2 = new Audio("./sounds/winSound2.mp3");
const winSound3 = new Audio("./sounds/winSound3.mp3");
const loseSound1 = new Audio("./sounds/loseSound1.wav");
const stageEndSound = new Audio("./sounds/stageEndSound.wav");
const hitSound = new Audio("./sounds/hitSound.wav");
const moveSound = new Audio("./sounds/moveSound.wav");
const playSound = new Audio("./sounds/playSound.wav");
const playBtnElement = document.querySelector("#play");
const boardDisplayElement = document.querySelector(".board");
const instructionsElement = document.querySelector(".instructions");
const titleElement = document.querySelector("#title-text");
const livesElement = document.querySelector("#live-count");
const levelElement = document.querySelector("#level-count");
const containerElement = document.querySelector(".container");
const playerSprite = document.createElement("img");
const loseMessageElement = document.querySelector("#lose-message");
const bodyDisplayElement = document.querySelector("body");
const volumeSliderBGElement = document.querySelector("#volume-sliderBG");
const volumeSliderSFXElement = document.querySelector("#volume-sliderSFX");
//event listeners
document.addEventListener("keydown", movePlayer);
document.querySelector("#play").addEventListener("click", startGame);
volumeSliderBGElement.addEventListener("input", (event) => {
    const volume = parseFloat(event.target.value);
    backgroundMusic.volume = volume;
});

/**
 * Displaying board and hiding Instruction values
 */
function startGame() {
    instructionsElement.style.display = "none";
    containerElement.style.display = "flex";
    init();
}
/**
 * Initalizing game values to there starting position
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
    playerPosition = { row: 6, col: 50 };
    baseSpeed = 21;
    spawnRate = 70;
    updateScrollSpeed(baseSpeed);
    titleElement.style.animation = "";
    containerElement.style.animation = "";
    loseMessageElement.style.display = "none";
    boardDisplayElement.style.zIndex = "";

    //checking if first playtthrough
    if (firstPlaythrough) {
        createBoard();
        playBackgroundMusic();
        firstPlaythrough = false;
    }
    playSfx(playSound, playSoundVolume, 0);
    winSound1.pause();
    winSound2.pause();
    winSound3.pause();
}
/**
 * Dynamically creates the board
 */
function createBoard() {
    for (let rowIndex = 0; rowIndex < boardHeight; rowIndex++) {
        for (let colIndex = 0; colIndex < boardWidth; colIndex++) {
            const square = document.createElement("div");
            square.classList.add("sqr");
            square.id = `h${rowIndex * boardWidth + colIndex}`;
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
                `h${rowIndex * boardWidth + colIndex}`
            );
            // Check if there's a hazard in the current cell and displaying hazard sprite
            if (cell === rejectionLetterId && !hasWon) {
                const hazardRejectLetter = document.createElement("img");
                hazardRejectLetter.src = "./images/hazardRejectLetter.png";
                hazardRejectLetter.alt = "Rejection Letter";
                square.appendChild(hazardRejectLetter);
            } else if (cell === spamFilterId && !hasWon) {
                const hazardSpamFilter = document.createElement("img");
                hazardSpamFilter.src = "./images/hazardSpamFilter.png";
                hazardSpamFilter.alt = "Spam Filter";
                square.appendChild(hazardSpamFilter);
            } else if (cell === atsBotId && !hasWon) {
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
/**
 * pushes shifts unshifts and pops values into the hazard rows in alternating directions
 */
function scrollHazards() {
    // For hazards moving left (rows 1, 3, 5)
    oddRow.forEach((rowIndex) => {
        // Get the row based on rowIndex
        let row = board[rowIndex];
        // Remove the last element from the row
        row.pop();
        //1 in diffiulty's value chance to be a hazard
        row.unshift(Math.floor(Math.random() * spawnRate * totalUniqueHazards));
    });

    // For hazards moving right (rows 2, 4)
    evenRow.forEach((rowIndex) => {
        // Get the row based on rowIndex
        let row = board[rowIndex];
        // Remove the first element from the row
        row.shift();
        //1 in diffiulty's value chance to be a hazard
        row.push(Math.floor(Math.random() * spawnRate * totalUniqueHazards));
    });
    updateBoard();
}
/**
 * Checking if a hazard hits the player
 */
function hazardCollision() {
    // Check if there’s a hazard within 7 horizontal grid spaces
    for (let offset = -7; offset <= 7; offset++) {
        if (offset === 0) continue;

        // Calculate the column to check (current column + offset)
        const checkCol = playerPosition.col + offset;

        // Make sure the check is within the valid board boundaries
        if (checkCol >= 0 && checkCol < board[0].length) {
            // Check if there's a hazard in this position
            if (
                board[playerPosition.row][checkCol] === rejectionLetterId ||
                board[playerPosition.row][checkCol] === spamFilterId ||
                board[playerPosition.row][checkCol] === atsBotId
            ) {
                //kill player
                lives--;
                playSfx(hitSound, hitSoundVolume, 0);
                playerPosition = { row: 6, col: 50 };
                //game over
                if (lives === 0) {
                    isDead = true;
                    loseJuice();
                }
                return;
            }
        }
    }
}
/**
 * updates the speed of the hazards makes it faster the higher level you are on
 * @param currentSpeed how fast you want the hazards to scroll lower is faster
 */
function updateScrollSpeed(currentSpeed) {
    scrollSpeed = currentSpeed - level;
    clearInterval(scrollInterval);
    scrollInterval = setInterval(scrollHazards, scrollSpeed);
}
/**r
 * Checking if player had made it to the end and hasn't already won
 */
function checkWin() {
    if (playerPosition.row === 0 && !hasWon && level < totalLevels) {
        level++;
        playerPosition = { row: 6, col: 50 };
        spawnRate = spawnRate - 2;
        playSfx(stageEndSound, 0);
        updateScrollSpeed(baseSpeed);
    }
    if (level === totalLevels) {
        hasWon = true;
        clearInterval(scrollInterval);
        winJuice();
    }
}
/**
 * Controls player movement and limits movement to existt within the board.
 * @param event looking for a move key to be pressed
 */
function movePlayer(event) {
    //locks movement if in final row
    if (!isDead && !hasWon) {
        switch (event.key) {
            //move left
            case "a":
                if (playerPosition.col > 10) {
                    playerPosition.col = playerPosition.col - 20;

                    playSfx(moveSound, moveSoundVolume, 0);
                }
                break;
            //move right
            case "d":
                if (playerPosition.col < 80) {
                    playerPosition.col = playerPosition.col + 20;
                    playSfx(moveSound, moveSoundVolume, 0);
                }
                break;
            //move up
            case "w":
                if (playerPosition.row <= 6) {
                    playerPosition.row--;
                    playSfx(moveSound, moveSoundVolume, 0);
                }
                break;
            //move down
            case "s":
                if (playerPosition.row < 6) {
                    playerPosition.row++;
                    playSfx(moveSound, moveSoundVolume, 0);
                }
                break;
        }
    }
    //resets game
    if (event.key === "r" && isDead) {
        init();
    } else if (event.key === "r" && hasWon) {
        init();
    }
}
/**
 * Plays background music for game
 */
function playBackgroundMusic() {
    backgroundMusic.volume = parseFloat(volumeSliderBGElement.value);
    backgroundMusic.loop = true;
    backgroundMusic.play();
}
/**
 * plays sfx
 */
function playSfx(sound, time) {
    sound.currentTime = time;
    sound.volume = parseFloat(volumeSliderSFXElement.value);
    sound.play();
}
/**
 * Handles sound and animation for when player wins
 */
function winJuice() {
    winSound1.volume = parseFloat(volumeSliderSFXElement.value);
    winSound2.volume = parseFloat(volumeSliderSFXElement.value);
    winSound3.volume = parseFloat(volumeSliderSFXElement.value);
    winSound1.currentTime = 0;
    winSound2.currentTime = 0;
    winSound3.currentTime = 0;
    winSound1.loop = true;
    winSound2.loop = true;
    winSound3.loop = true;
    winSound1.play();
    winSound2.play();
    winSound3.play();
    boardDisplayElement.style.zIndex = "-1";
    containerElement.style.animation = "1s lose linear infinite";
    titleElement.style.animation = "2s flashTitle linear infinite";


/**
 * Shakes screen and flashs title and makes hazards scroll real fast on game over
 */
}
function loseJuice() {
    playSfx(loseSound1, 0);
    containerElement.style.animation = "1s lose linear infinite";
    loseMessageElement.style.display = "flex";
    titleElement.style.animation = "2s flashTitle linear infinite";
    updateScrollSpeed(1);
}
/**
 * Change title based on game state
 */
function displayTitle() {
    if (hasWon) {
        titleElement.textContent = "HIRED!";
    } else if (isDead) {
        titleElement.textContent = "UNEMPLOYED!";
    } else {
        titleElement.textContent = "RESUMANIA";
    }
}
/**
 * Updatets the lives and level count
 */
function updateHud() {
    livesElement.textContent = `Applications Left: ${lives}`;
    levelElement.textContent = `Interview #${level}`;
    if (lives === 1) {
        livesElement.style.animation = "2s flashLives linear infinite";
    } else {
        livesElement.style.animation = "";
    }
}


// =====================================================
//                  CRACK THE CODE
//              COMPLETE GAME LOGIC
// =====================================================


// ================= GAME CONFIG =================

const CODE_LEN = 3;


// Difficulty settings

const DIFFICULTIES = {

    easy: {
        time: 15,
        attempts: 10
    },

    medium: {
        time: 10,
        attempts: 7
    },

    hard: {
        time: 7,
        attempts: 6
    }

};


// Current settings

let currentDifficulty = "easy";

let TIME_LIMIT = 15;

let ATTEMPTS = 10;


// Secret code

let secretCode = [];


// Timer

let timer = null;

let timeLeft = TIME_LIMIT;


// Game state

let gameStarted = false;


// ================= HTML ELEMENTS =================


// Difficulty

const easyBtn =
    document.getElementById("easyBtn");

const mediumBtn =
    document.getElementById("mediumBtn");

const hardBtn =
    document.getElementById("hardBtn");


// Display

const timeDisplay =
    document.getElementById("timeDisplay");

const attemptDisplay =
    document.getElementById("attemptDisplay");

const timerProgress =
    document.getElementById("timerProgress");


// Inputs

const digit1 =
    document.getElementById("digit1");

const digit2 =
    document.getElementById("digit2");

const digit3 =
    document.getElementById("digit3");


// Buttons

const crackBtn =
    document.getElementById("crackBtn");

const playAgainBtn =
    document.getElementById("playAgainBtn");


// Hints

const correctPosition =
    document.getElementById("correctPosition");

const correctDigit =
    document.getElementById("correctDigit");

const analysisMessage =
    document.getElementById("analysisMessage");


// Game message

const gameMessage =
    document.getElementById("gameMessage");


// Modal

const gameModal =
    document.getElementById("gameModal");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const secretDisplay =
    document.getElementById("secretDisplay");


// =====================================================
//                  GENERATE CODE
// =====================================================

function generateCode() {

    secretCode = [];


    while (
        secretCode.length < CODE_LEN
    ) {

        const digit =
            Math.floor(
                Math.random() * 10
            );


        // Non-repeating digits

        if (
            !secretCode.includes(digit)
        ) {

            secretCode.push(digit);

        }

    }


    console.log(
        "Secret Code:",
        secretCode.join("")
    );

}


// =====================================================
//                  SELECT DIFFICULTY
// =====================================================

function selectDifficulty(level) {

    currentDifficulty = level;


    TIME_LIMIT =
        DIFFICULTIES[level].time;


    ATTEMPTS =
        DIFFICULTIES[level].attempts;


    // Update active button

    easyBtn.classList.remove("active");

    mediumBtn.classList.remove("active");

    hardBtn.classList.remove("active");


    if (level === "easy") {

        easyBtn.classList.add("active");

    }


    if (level === "medium") {

        mediumBtn.classList.add("active");

    }


    if (level === "hard") {

        hardBtn.classList.add("active");

    }


    startNewGame();

}


// =====================================================
//                  START NEW GAME
// =====================================================

function startNewGame() {

    // Stop previous timer

    clearInterval(timer);


    // Generate new code

    generateCode();


    // Reset time

    timeLeft = TIME_LIMIT;


    // Reset state

    gameStarted = true;


    // Reset UI

    correctPosition.textContent = "0";

    correctDigit.textContent = "0";


    analysisMessage.textContent =
        "Enter your guess to receive a clue.";


    gameMessage.textContent = "";


    crackBtn.innerHTML =
        '<span class="button-icon">🔓</span> CRACK CODE';


    // Clear input

    clearInputs();


    // Update display

    updateDisplay();


    // Start timer

    startTimer();

}


// =====================================================
//                  UPDATE DISPLAY
// =====================================================

function updateDisplay() {

    timeDisplay.textContent =
        timeLeft;


    attemptDisplay.textContent =
        ATTEMPTS;


    const percentage =
        (timeLeft / TIME_LIMIT) * 100;


    timerProgress.style.width =
        percentage + "%";


    // Timer colors

    if (
        percentage > 50
    ) {

        timerProgress.style.background =
            "linear-gradient(90deg,#00ff88,#00d9ff)";

    }

    else if (
        percentage > 25
    ) {

        timerProgress.style.background =
            "#ffd600";

    }

    else {

        timerProgress.style.background =
            "#ff3b5c";

    }

}


// =====================================================
//                  TIMER
// =====================================================

function startTimer() {

    clearInterval(timer);


    timer = setInterval(
        function () {

            if (!gameStarted) {

                clearInterval(timer);

                return;

            }


            timeLeft--;


            updateDisplay();


            // Time over

            if (
                timeLeft <= 0
            ) {

                clearInterval(timer);


                handleTimeOut();

            }

        },

        1000
    );

}


// =====================================================
//                  TIME OUT
// =====================================================

function handleTimeOut() {

    ATTEMPTS--;


    showMessage(
        "⏰ Time exceeded! Attempt wasted.",
        "red"
    );


    updateDisplay();


    if (
        ATTEMPTS <= 0
    ) {

        gameOver();

        return;

    }


    // New attempt

    timeLeft = TIME_LIMIT;


    updateDisplay();


    clearInputs();


    startTimer();

}


// =====================================================
//                  GET GUESS
// =====================================================

function getGuess() {

    return [

        Number(digit1.value),

        Number(digit2.value),

        Number(digit3.value)

    ];

}


// =====================================================
//                  CHECK HINT
// =====================================================

function checkHint(
    code,
    guess
) {

    let cp = 0;

    let cd = 0;


    const usedCode =
        [false, false, false];


    const usedGuess =
        [false, false, false];


    // ---------------------------------------------
    // Correct Position
    // ---------------------------------------------

    for (
        let i = 0;
        i < CODE_LEN;
        i++
    ) {

        if (
            code[i] === guess[i]
        ) {

            cp++;


            usedCode[i] = true;

            usedGuess[i] = true;

        }

    }


    // ---------------------------------------------
    // Correct Digit
    // ---------------------------------------------

    for (
        let i = 0;
        i < CODE_LEN;
        i++
    ) {

        if (
            !usedGuess[i]
        ) {

            for (
                let j = 0;
                j < CODE_LEN;
                j++
            ) {

                if (

                    !usedCode[j] &&

                    guess[i] === code[j]

                ) {

                    cd++;


                    usedCode[j] = true;


                    break;

                }

            }

        }

    }


    return {

        correctPosition: cp,

        correctDigit: cd

    };

}


// =====================================================
//                  CRACK CODE
// =====================================================

function crackCode() {


    // Make sure all digits entered

    if (

        digit1.value === "" ||

        digit2.value === "" ||

        digit3.value === ""

    ) {

        showMessage(
            "⚠️ Please enter all 3 digits.",
            "yellow"
        );

        return;

    }


    const guess =
        getGuess();


    // Validate digits

    for (
        const digit of guess
    ) {

        if (
            digit < 0 ||
            digit > 9 ||
            !Number.isInteger(digit)
        ) {

            showMessage(
                "⚠️ Enter digits from 0 to 9.",
                "red"
            );

            return;

        }

    }


    // Stop timer while checking

    clearInterval(timer);


    // Calculate hint

    const result =
        checkHint(
            secretCode,
            guess
        );


    const cp =
        result.correctPosition;

    const cd =
        result.correctDigit;


    // Update hint

    correctPosition.textContent =
        cp;

    correctDigit.textContent =
        cd;


    // =================================================
    // WIN
    // =================================================

    if (
        cp === CODE_LEN
    ) {

        gameStarted = false;


        showWinScreen();


        return;

    }


    // =================================================
    // ATTEMPT USED
    // =================================================

    ATTEMPTS--;


    updateDisplay();


    // =================================================
    // GAME OVER
    // =================================================

    if (
        ATTEMPTS <= 0
    ) {

        gameOver();

        return;

    }


    // =================================================
    // ANALYSIS
    // =================================================

    explainSituation(
        cp,
        cd
    );


    // Next attempt

    timeLeft = TIME_LIMIT;


    updateDisplay();


    clearInputs();


    startTimer();

}


// =====================================================
//                  EXPLAIN SITUATION
// =====================================================

function explainSituation(
    cp,
    cd
) {


    if (
        cp === 0 &&
        cd === 0
    ) {

        analysisMessage.textContent =
            "❌ All digits are wrong. Eliminate them.";

        showMessage(
            "All digits are wrong.",
            "red"
        );

    }


    else if (
        cp > 0 &&
        cd === 0
    ) {

        analysisMessage.textContent =
            "🟩 Some digits are in the correct position. Lock them.";

        showMessage(
            "Some digits are correctly positioned.",
            "green"
        );

    }


    else if (
        cp === 0 &&
        cd > 0
    ) {

        analysisMessage.textContent =
            "🟨 Correct digits found, but their positions are wrong. Move them.";

        showMessage(
            "Correct digits found, but wrong positions.",
            "yellow"
        );

    }


    else {

        analysisMessage.textContent =
            "🟩 Some digits are locked and 🟨 some need position changes.";

        showMessage(
            "Some digits are correct and some need moving.",
            "blue"
        );

    }

}


// =====================================================
//                  WIN SCREEN
// =====================================================

function showWinScreen() {

    clearInterval(timer);


    resultIcon.textContent =
        "🏆";


    resultTitle.textContent =
        "YOU CRACKED THE CODE!";


    resultTitle.style.color =
        "#00ff88";


    resultText.textContent =
        "Excellent! You broke the secret code.";


    secretDisplay.textContent =
        secretCode.join("");


    gameModal.classList.add(
        "show"
    );

}


// =====================================================
//                  GAME OVER
// =====================================================

function gameOver() {

    clearInterval(timer);


    gameStarted = false;


    resultIcon.textContent =
        "💀";


    resultTitle.textContent =
        "GAME OVER";


    resultTitle.style.color =
        "#ff3b5c";


    resultText.textContent =
        "You used all your attempts.";


    secretDisplay.textContent =
        secretCode.join("");


    gameModal.classList.add(
        "show"
    );

}


// =====================================================
//                  CLEAR INPUTS
// =====================================================

function clearInputs() {

    digit1.value = "";

    digit2.value = "";

    digit3.value = "";


    digit1.focus();

}


// =====================================================
//                  MESSAGE
// =====================================================

function showMessage(
    message,
    type
) {

    gameMessage.textContent =
        message;


    if (
        type === "green"
    ) {

        gameMessage.style.color =
            "#00ff88";

    }

    else if (
        type === "yellow"
    ) {

        gameMessage.style.color =
            "#ffd600";

    }

    else if (
        type === "red"
    ) {

        gameMessage.style.color =
            "#ff3b5c";

    }

    else {

        gameMessage.style.color =
            "#00d9ff";

    }

}


// =====================================================
//                  PLAY AGAIN
// =====================================================

playAgainBtn.addEventListener(
    "click",
    function () {

        gameModal.classList.remove(
            "show"
        );


        startNewGame();

    }
);


// =====================================================
//                  DIFFICULTY EVENTS
// =====================================================

easyBtn.addEventListener(
    "click",
    function () {

        selectDifficulty("easy");

    }
);


mediumBtn.addEventListener(
    "click",
    function () {

        selectDifficulty("medium");

    }
);


hardBtn.addEventListener(
    "click",
    function () {

        selectDifficulty("hard");

    }
);


// =====================================================
//                  CRACK BUTTON
// =====================================================

crackBtn.addEventListener(
    "click",
    function () {

        if (
            gameStarted
        ) {

            crackCode();

        }

    }
);


// =====================================================
//                  AUTO MOVE INPUT
// =====================================================

digit1.addEventListener(
    "input",
    function () {

        digit1.value =
            digit1.value.replace(
                /[^0-9]/g,
                ""
            );


        if (
            digit1.value.length === 1
        ) {

            digit2.focus();

        }

    }
);


digit2.addEventListener(
    "input",
    function () {

        digit2.value =
            digit2.value.replace(
                /[^0-9]/g,
                ""
            );


        if (
            digit2.value.length === 1
        ) {

            digit3.focus();

        }

    }
);


digit3.addEventListener(
    "input",
    function () {

        digit3.value =
            digit3.value.replace(
                /[^0-9]/g,
                ""
            );

    }
);


// =====================================================
//                  ENTER KEY
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            crackCode();

        }

    }
);


// =====================================================
//                  START GAME
// =====================================================

startNewGame();

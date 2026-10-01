#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <windows.h>

/* ---------- COLOR CODES (OUTPUT KO COLORFUL BANANE KE LIYE) ---------- */
#define GREEN  "\033[1;32m"   // Correct position / success
#define YELLOW "\033[1;33m"   // Correct digit but wrong position
#define RED    "\033[1;31m"   // Wrong / warning / game over
#define CYAN   "\033[1;36m"   // General information
#define RESET  "\033[0m"      // Color reset

/* ---------- GAME CONFIGURATION ---------- */
#define CODE_LEN 3            // Secret code ki length fix (3 digits)

/* ---------- GLOBAL VARIABLES ---------- */
/* Difficulty ke according ye values change hoti hain */
int TIME_LIMIT;               // Ek attempt ke liye time limit
int ATTEMPTS;             // Total attempts allowed

/* ---------- FUNCTION DECLARATIONS ---------- */
void generateCode(int code[], int range);
void countdown();
void checkHint(int code[], int guess[], int *cp, int *cd);
void explainSituation(int cp, int cd);

/* ===================== MAIN FUNCTION ===================== */
int main() {

    int code[CODE_LEN];       // Secret code store karega
    int guess[CODE_LEN];      // Player ka guess store karega
    int difficulty;           // Difficulty choice

    srand(time(0));           // Random number generator ko seed dena

    /* ---------- GAME MENU ---------- */
    printf(CYAN "=== CRACK THE CODE GAME ===\n" RESET);
    printf(CYAN "1. Easy\n2. Medium\n3. Hard\n" RESET);
    printf(CYAN "Select difficulty: " RESET);
    scanf("%d", &difficulty);

    /* ---------- DIFFICULTY SETTINGS ---------- */
    /* Difficulty ke hisaab se time aur attempts set hote hain */
    if(difficulty == 1) {
        TIME_LIMIT = 15;
        ATTEMPTS = 10;
    }
    else if(difficulty == 2) {
        TIME_LIMIT = 10;
        ATTEMPTS = 7;
    }
    else {
        TIME_LIMIT = 7;
        ATTEMPTS = 6;
    }

    /* ---------- SECRET CODE GENERATION ---------- */
    /* Random aur non-repeating secret code banaya ja raha hai */
    generateCode(code, 10);

    printf(GREEN "\nGame Started\n" RESET);
    printf(CYAN "Time per attempt: %d seconds\n" RESET, TIME_LIMIT);

    /* ===================== GAME LOOP ===================== */
    /* Ye loop tab tak chalega jab tak attempts bache hain */
    while(ATTEMPTS > 0) {

        int correctPos = 0;   // Correct digit + correct position
        int correctDigit = 0;// Correct digit but wrong position
        time_t startTime, endTime;

        /* ---------- COUNTDOWN TIMER ---------- */
        /* Player ko pressure dene ke liye visible countdown */
        countdown();

        /* ---------- INPUT WITH TIMER ---------- */
        printf(CYAN "Enter your 3-digit guess: " RESET);
        startTime = time(NULL);   // Input start time

        for(int i = 0; i < CODE_LEN; i++) {
            scanf("%d", &guess[i]);
        }

        endTime = time(NULL);     // Input end time

        /* ---------- TIME LIMIT CHECK ---------- */
        /* Agar player ne time limit cross ki */
        if(difftime(endTime, startTime) > TIME_LIMIT) {
            printf(RED "\nTime exceeded. Attempt wasted.\n" RESET);
            Beep(300, 400);
            ATTEMPTS--;
            printf(RED "Attempts left: %d\n" RESET, ATTEMPTS);
            continue;   // Hint calculate nahi hoga
        }

        /* ---------- HINT CALCULATION ---------- */
        /* Correct Position aur Correct Digit nikalne ka logic */
        checkHint(code, guess, &correctPos, &correctDigit);

        /* ---------- COLOR + SOUND HINT DISPLAY ---------- */
        printf(CYAN "\nHint: " RESET);

        /* Green blocks = correct position */
        for(int i = 0; i < correctPos; i++) {
            printf(GREEN "■ " RESET);
            Beep(900, 150);
        }

        /* Yellow blocks = correct digit but wrong position */
        for(int i = 0; i < correctDigit; i++) {
            printf(YELLOW "■ " RESET);
            Beep(600, 150);
        }

        printf("\n");
        printf(GREEN "Correct Position: %d\n" RESET, correctPos);
        printf(YELLOW "Correct Digit   : %d\n" RESET, correctDigit);

        /* ---------- LOGIC EXPLANATION ---------- */
        /* Player ko batata hai next move kya hona chahiye */
        explainSituation(correctPos, correctDigit);

        /* ---------- WIN CONDITION ---------- */
        if(correctPos == CODE_LEN) {
            printf(GREEN "\nYOU CRACKED THE CODE\n" RESET);
            Beep(1200, 300);
            Beep(1500, 300);
            break;
        }

        ATTEMPTS--;
        printf(CYAN "Attempts left: %d\n" RESET, ATTEMPTS);
    }

    /* ---------- GAME OVER ---------- */
    if(ATTEMPTS == 0) {
        printf(RED "\nGAME OVER\nSecret Code: " RESET);
        for(int i = 0; i < CODE_LEN; i++) {
            printf(RED "%d " RESET, code[i]);
        }
        printf("\n");
    }

    return 0;
}

/* ===================== FUNCTIONS ===================== */

/* ---------- SECRET CODE GENERATOR ---------- */
/* Non-repeating random digits generate karta hai */
void generateCode(int code[], int range) {
    for(int i = 0; i < CODE_LEN; i++) {
        int unique;
        do {
            unique = 1;
            code[i] = rand() % range;
            for(int j = 0; j < i; j++) {
                if(code[i] == code[j]) {
                    unique = 0;
                    break;
                }
            }
        } while(!unique);
    }
}

/* ---------- COUNTDOWN TIMER ---------- */
/* Time ko color ke saath dikhata hai */
void countdown() {
    for(int i = TIME_LIMIT; i > 0; i--) {

        if(i > TIME_LIMIT / 2)
            printf(GREEN "\rTime Remaining: %2d seconds " RESET, i);
        else if(i > TIME_LIMIT / 4)
            printf(YELLOW "\rTime Remaining: %2d seconds " RESET, i);
        else
            printf(RED "\rTime Remaining: %2d seconds " RESET, i);

        fflush(stdout);
        Sleep(1000);
    }
    printf("\n");
}

/* ---------- HINT CHECKING LOGIC ---------- */
/* Correct Position aur Correct Digit calculate karta hai */
void checkHint(int code[], int guess[], int *cp, int *cd) {

    int usedCode[CODE_LEN] = {0};
    int usedGuess[CODE_LEN] = {0};

    for(int i = 0; i < CODE_LEN; i++) {
        if(code[i] == guess[i]) {
            (*cp)++;
            usedCode[i] = 1;
            usedGuess[i] = 1;
        }
    }

    for(int i = 0; i < CODE_LEN; i++) {
        if(!usedGuess[i]) {
            for(int j = 0; j < CODE_LEN; j++) {
                if(!usedCode[j] && guess[i] == code[j]) {
                    (*cd)++;
                    usedCode[j] = 1;
                    break;
                }
            }
        }
    }
}

/* ---------- SITUATION EXPLANATION ---------- */
/* Hint ka matlab simple language me batata hai */
void explainSituation(int cp, int cd) {

    if(cp == 0 && cd == 0)
        printf(RED "Analysis: All digits are wrong. Eliminate them.\n" RESET);
    else if(cp > 0 && cd == 0)
        printf(GREEN "Analysis: Some digits are in correct position. Lock them.\n" RESET);
    else if(cp == 0 && cd > 0)
        printf(YELLOW "Analysis: Digits are correct but positions are wrong. Move them.\n" RESET);
    else
        printf(CYAN "Analysis: Some digits are locked and some need position change.\n" RESET);
}

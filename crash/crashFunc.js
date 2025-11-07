//crashFunc.js
// Created by Jack Morice
// EECS 581: Group 21 Project 3
// Crash Game Logic
// Inputs/Outputs
//  Inputs: User Bet Amount, Start Game Button, Cash Out Button, Reset Button
//  Outputs: Change in Balance

//Global Variables
let multiplier = 0.00; //Multiplier amount starting at 0
let crashPoint = 0; //Point at which the game will "Crash" at
let gameActive = false; //Is the game currently active
let autoCashAmount = 0; //Auto cash-out number
let intervalId = null; //Interval ID for game loop
let betAmount = 0; //User bet amount

 //UI Elements
function updateBalance() { //Update balance display
  document.getElementById("balance").textContent = GoonCoin; //Update balance display
  saveGoonCoin(); //Save updated balance
}

function uiUpdate() { //Update UI elements
    const mEl = document.getElementById("multiplier"); // Multiplier display element
    if (mEl) mEl.innerText = multiplier.toFixed(2) + "x"; // Update multiplier display
}

//Game Elements
function startLoop() { //Start game loop
    const tickMs = 100; // tick interval in milliseconds
    const growthPerTick = 0.01; // multiplicative growth

    if (intervalId) { // Clear existing interval if any
        clearInterval(intervalId);
        intervalId = null; // reset interval ID
    }

    intervalId = setInterval(() => {
        if (!gameActive) { //if the game is not active, stop the loop
            clearInterval(intervalId); //clear interval
            intervalId = null; //reset interval ID
            return; //exit function
        }

        // multiplicative growth for accelerating multiplier
        multiplier = multiplier + 0.01 * (1 + growthPerTick);
        uiUpdate(); //update UI

        if (autoCashAmount > 0 && multiplier >= autoCashAmount) { //if auto cash-out is set and reached
            multiplier = autoCashAmount; //set multiplier to auto cash amount
            uiUpdate(); //update UI
            cashOut(); //auto cash out
            return;
        }

        if (multiplier >= crashPoint) { //if the multiplier reaches the crash point before cashing out
            crashOut(); //crash out
            return; //exit function
        }
    }, tickMs); //end of setInterval
}

function startGame() { //start game function
    if (gameActive){ //prevent starting a new game if one is already active
        return;
    }
    const betInput = document.getElementById("bet"); //get bet input element
    const autoCashInput = document.getElementById("autoCashInput"); //get auto cash input element
    betAmount = parseInt(betInput.value); //get bet amount as integer
    autoCashAmount = parseFloat(autoCashInput.value) || 0; //get auto cash amount or 0 if invalid
    gameActive = true; //set game as active
    GoonCoin -= betAmount; //Subtract bet amount initially
    updateBalance(); //Update balance display
    multiplier = 0.00; //set multiplier to 0
    crashPoint = Math.random() * 10; //random crash point between 0 and 10
    document.getElementById("result-message").innerText = ""; //clear result message
    document.getElementById("cashoutBtn").disabled = false; //enable cashout button
    document.getElementById("startBtn").disabled = true; //disable start button
    uiUpdate(); //update UI
    updateBalance(); //update balance
    startLoop(); //start game
}

function crashOut() { //crash out function
    gameActive = false; //set game as inactive
    if (intervalId) { //if interval is running
        clearInterval(intervalId); //clear interval
        intervalId = null; //reset interval ID
    }
    document.getElementById("result-message").innerText = "CRASHED at " + multiplier.toFixed(2) + "x"; //display crash message
    document.getElementById("cashoutBtn").disabled = true; //disable cashout button
    document.getElementById("startBtn").disabled = false; //enable start button
    betAmount = 0; //reset bet amount
    updateBalance(); //update balance
    uiUpdate(); //update UI
}

function cashOut() { //cash out function
    gameActive = false; //set game as inactive
    GoonCoin += Math.floor(multiplier * betAmount); //add win bet multiplied by current multiplier rounded down to balance
    updateBalance(); //update balance
    if (intervalId) { //if interval is running
        clearInterval(intervalId); //clear interval
        intervalId = null; //reset interval ID
    }
    const payoutText = "Cashed out at " + multiplier.toFixed(2) + "x"; //create payout message
    document.getElementById("result-message").innerText = payoutText; //display payout message
    document.getElementById("cashoutBtn").disabled = true; //disable cashout button
    document.getElementById("startBtn").disabled = false; //enable start button
    betAmount = 0; //clear bet amount
    uiUpdate(); //update UI
}

function resetGame() { //reset game function
    if (intervalId) { //if interval is running
        clearInterval(intervalId); //clear interval
        intervalId = null; //reset interval ID
    }
    gameActive = false; //set game as inactive
    multiplier = 0.00; //reset multiplier
    crashPoint = 0; //reset crash point
    document.getElementById("result-message").innerText = ""; //clear result message
    document.getElementById("cashoutBtn").disabled = true; //disable cashout button
    document.getElementById("startBtn").disabled = false; //enable start button
    uiUpdate(); //update UI
}

function setAutoCash() { //set auto cash-out amount
    const input = document.getElementById("autoCashInput"); //get auto cash input element
    autoCashAmount = parseFloat(input.value) || 0; //set auto cash amount or 0 if invalid
}

//Page Elements
window.addEventListener("DOMContentLoaded", () => { //on page load
    let balanceDisplay = document.getElementById("balance"); //get balance display element
    balanceDisplay.textContent = GoonCoin; //set initial balance display
    const startBtn = document.getElementById("startBtn"); //get start button element
    const cashBtn = document.getElementById("cashoutBtn"); //get cashout button element
    const resetBtn = document.getElementById("resetBtn"); //get reset button element
    if (startBtn) {
        startBtn.addEventListener("click", startGame); //add start button event listener
    }
    if (cashBtn) {
        cashBtn.addEventListener("click", cashOut); //add cashout button event listener
    }
    if (resetBtn) {
        resetBtn.addEventListener("click", resetGame); //add reset button event listener
    }
    uiUpdate(); //update UI
});
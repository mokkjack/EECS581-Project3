/* ======================================================================== *
 * Prologue Comments for crashFunc.js                                       *
 * File Name: crashFunc.js                                                  *
 * Authors: Jack Morice                                                     *
 * EECS 581: Group 21 Project 3                                             *
 * ------------------------------------------------------------------------ *
 * Code-sino Crash Game Logic                                               *
 * Inputs/Outputs                                                           *
 *  Inputs:     User Bet Amount, Start Game Button, Cash Out Button,        *
 *              Reset Button                                                *
 *  Outputs:    Change in Balance                                           *
 * Purpose:    The JavaScript Section for crash of Codesino                 *
 * ======================================================================== */

//Global Variables
let multiplier = 1; //Multiplier amount starting at 0
let crashPoint = 0; //Point at which the game will "Crash" at
let gameActive = false; //Is the game currently active
let autoCashAmount = 0; //Auto cash-out number
let intervalId = null; //Interval ID for game loop
let betAmount = 0; //User bet amount
let growthPerTick=0.01; //Growth rate per tick
let multiplierChart; //Chart.js instance for multiplier chart
let multiplierData = { //Data for multiplier chart
    labels: [],
    datasets: [{
        data: [],
        borderColor: 'rgba(47, 255, 0, 1)',
        fill: false,
        tension: 0.1
    }]
};

function initChart() { //create the chart
    const ctx = document.getElementById('multiplierChart').getContext('2d');
    multiplierChart = new Chart(ctx, { //chart settings
        type: 'line',
        data: multiplierData,
        options: {
            animation: true,
            plugins: {
                legend: {
                    display: false // Hide the legend
                }
            },
            scales: {
                x: { 
                    title: 
                    { 
                        display: true, 
                        text: 'Time' 
                    },
                    beginAtZero: true
                },
                y: { 
                    title: 
                    { 
                        display: true, 
                        text: 'Multiplier' 
                    }, 
                    min: 1 
                }
            }
        }
    });
}

function updateChart(multiplier) { //update chart with new multiplier value
    multiplierData.labels.push(multiplierData.labels.length);
    multiplierData.datasets[0].data.push(multiplier);
    multiplierChart.update();
}

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
    growthPerTick = 0.01; // multiplicative growth

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
        multiplier = multiplier * (1 + growthPerTick);
        updateChart(multiplier);
        uiUpdate(); //update UI
        // growthPerTick += 0.01; //increase growth rate

        if (autoCashAmount > 0 && multiplier >= autoCashAmount) { //if auto cash-out is set and reached
            multiplier = autoCashAmount; //set multiplier to auto cash amount
            uiUpdate(); //update UI
            cashOut(); //auto cash out
            return;
        }

        if (multiplier >= crashPoint) { //if the multiplier reaches the crash point before cashing out
            console.log("yep");
            crashOut(); //crash out
            return; //exit function
        }
    }, tickMs); //end of setInterval
}

function startGame() { //start game function
    if (gameActive){ //prevent starting a new game if one is already active
        return;
    }
    resetChart(); //reset chart datare
    const betInput = document.getElementById("bet"); //get bet input element
    const autoCashInput = document.getElementById("autoCashInput"); //get auto cash input element
    betAmount = parseInt(betInput.value); //get bet amount as integer
    if (betAmount > GoonCoin){ //check if bet amount exceeds balance
        alert("Insufficient GoonCoin for this bet!");
        return;
    }
    autoCashAmount = parseFloat(autoCashInput.value) || 0; //get auto cash amount or 0 if invalid
    gameActive = true; //set game as active
    GoonCoin -= betAmount; //Subtract bet amount initially
    updateBalance(); //Update balance display
    multiplier = 1; //set multiplier to 1
    growthPerTick=0.01; //Growth rate per tick
    crashPoint = Math.random() * 10; //random crash point between 0 and 10
    console.log("Crash Point set at: " + crashPoint.toFixed(2) + "x"); //log crash point for testing
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
    document.getElementById("result-message").style.color = "red"; //set crash message color to red
    document.getElementById("result-message").style.fontSize = "80px"; //increase multiplier font size on crash
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
    document.getElementById("result-message").style.color = "greenyellow"; //set payout message color to greenyellow
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
    resetChart(); //reset chart data
    gameActive = false; //set game as inactive
    multiplier = 1; //reset multiplier
    crashPoint = 0; //reset crash point
    growthPerTick=0.01; //Growth rate per tick
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
    initChart(); //initialize chart
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

function resetChart() { //reset chart data
    multiplierData.labels = [];
    multiplierData.datasets[0].data = [];
    multiplierChart.update();
}
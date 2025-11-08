/*Prologue comment:
File Name: home_func
EECS 581 Project 3
Author: Zhang Chen
Purpose: This file provide the logic for a global currency named GoonCoin and bailouttime(temp)
This file mainly provide the logic for a global currency and bailout function that will bre presistent across multiple game
Input: None
Output: Show user's global currency in the main menu, and reflect the changed io it, also provide a initial amount.
*/

//a global variable for bailout time
var bailouttime = parseInt(sessionStorage.getItem("bailouttime")) || 0;

// Global GoonCoin
var GoonCoin = sessionStorage.getItem("GoonCoin");
//if GoonCoin is not initialized, set the value as 1000, then save the currency into a session storage
if (GoonCoin === null) {
    GoonCoin = 1000;
    sessionStorage.setItem("GoonCoin", GoonCoin);
    //if the GoonCoin is already initialized, parsed the current interger of GoonCoin
} else {
    GoonCoin = parseInt(GoonCoin);
}

// Save GoonCoin to sessionStorage
function saveGoonCoin() {
    sessionStorage.setItem("GoonCoin", GoonCoin);
}

// Save bailouttime to sessionStorage
function saveBailoutTime() {
    sessionStorage.setItem("bailouttime", bailouttime);
}

// Bailout function
function bailout() {
    if (GoonCoin === 0) {
        GoonCoin += 1000;
        bailouttime += 1;
        saveGoonCoin();
        saveBailoutTime();
        updateCurrencyDisplay();
    }
}

// Update homepage currency display
function updateCurrencyDisplay() {
    //created a constant variable called currencyElement to get the element id currency from deafult.html
    const currencyElement = document.getElementById("currency");
    //if currencyElement existed
    if (currencyElement) {
        //declared a local vairable to get GoonCoin amount form session storage
        let stored = sessionStorage.getItem("GoonCoin");
        //A quick condition check to see if GoonCoin existed, if it doesnt exist, set GoonCoin to 1000
        GoonCoin = stored !== null ? parseInt(stored) : 1000;
        //updated the currency element in defualt.html
        currencyElement.textContent = GoonCoin;
    }
    const bailoutCountElement = document.getElementById("bailout-count");
    if (bailoutCountElement) {
        let storedBailout = sessionStorage.getItem("bailouttime");
        bailouttime = storedBailout !== null ? parseInt(storedBailout) : 0;
        bailoutCountElement.textContent = bailouttime;
    }
}

// Called on initial load
window.addEventListener("load", () => {
    updateCurrencyDisplay();
});

// Also update when page is shown from bfcache (back button)
window.addEventListener("pageshow", () => {
    updateCurrencyDisplay();
});
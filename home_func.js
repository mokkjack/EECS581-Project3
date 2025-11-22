/* ======================================================================== *
 * Prologue Comments for home_func.js                                       *
 * File Name: home_func.js                                                  *
 * Authors: Zhang Chen                                                      *
 * EECS 581: Group 21 Project 3                                             *
 * ------------------------------------------------------------------------ *
 * Code-sino Homepage Function                                              *
 * Inputs/Outputs                                                           *
 *  Inputs:     None                                                        *
 *  Outputs:    Show user's global currency in the main menu, and reflect   *
 *              the changed io it, also provide a initial amount.           *
 *  Purpose:    This file provide the logic for a global currency named     *
 *              GoonCoin and bailouttime(temp). This file mainly provide    *
 *              the logic for a global currency and bailout function that   *
 *              will be presistent across multiple game.                    *
 * ======================================================================== */

//a global variable for bailout time
var bailouttime = parseInt(sessionStorage.getItem("bailouttime")) || 0;

//a global array for unlocked themes
var unlocked_themes = sessionStorage.getItem("unlocked_themes") || [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 1 = UNLOCKED | 0 = LOCKED

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



/* ======================================================================== *
 * Save Functions                                                           *
 * ======================================================================== */

// Save GoonCoin to sessionStorage
function saveGoonCoin() {
    sessionStorage.setItem("GoonCoin", GoonCoin);
}

// Save bailouttime to sessionStorage
function saveBailoutTime() {
    sessionStorage.setItem("bailouttime", bailouttime);
}

// Save unlocked_themes to sessionStorage
function saveThemeArray() {
    sessionStorage.setItem("unlocked_themes", unlocked_themes);
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



/* ======================================================================== *
 * Window Onload Function                                                   *
 * ======================================================================== */

// Called on initial load
window.addEventListener("load", () => {
    updateCurrencyDisplay();
});

// Also update when page is shown from bfcache (back button)
window.addEventListener("pageshow", () => {
    updateCurrencyDisplay();
});
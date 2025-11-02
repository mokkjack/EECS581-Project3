//home_func.js

/* EECS 581: Group 21 Project 3
 * The JavaScript Section for the Homepage
 * of Codesino.
 */

//Definitions
const CURRENCY_SPOT = document.getElementById("currency");

//Global Variables
let CURRENCY_AMOUNT = 0;
let FIRST_LOGIN = true;

//Import & Export
export const c = CURRENCY_AMOUNT; 


//Functions
function currency() {
    if (FIRST_LOGIN) {
        CURRENCY_AMOUNT = 500;
        FIRST_LOGIN = false;
    }
    CURRENCY_SPOT.innerHTML = CURRENCY_AMOUNT;
}

function decrease() {
    CURRENCY_AMOUNT = CURRENCY_AMOUNT - 100;
    currency();
    return;
}

function increase() {
    CURRENCY_AMOUNT = CURRENCY_AMOUNT + 100;
    currency();
    return;
}
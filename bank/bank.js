/* ======================================================================== *
 * Prologue Comments for bank.js                                            *
 * File Name: bank.js                                                       *
 * Authors: 
 * EECS 581: Group 21 Project 3                                             *
 * ------------------------------------------------------------------------ *
 * Code-sino Bank Function                                                  *
 * Inputs/Outputs                                                           *
 *  Inputs:     Bailout Button                                              *
 *  Outputs:    Currency Reset | Bailout Incrementation                     *
 * ======================================================================== */

//Global Variables
var currencyDisplay = document.getElementById("currency");
var balanceDisplay = document.getElementById("balance");
var bailoutCountDisplay = document.getElementById("bailout-count");

//Update Balance Function
function updateBalance() {
  currencyDisplay.textContent = GoonCoin;
  bailoutCountDisplay.textContent = bailouttime;
  saveGoonCoin();
  saveBailoutTime();
}

//On-Load Function
document.addEventListener("DOMContentLoaded", () => {
  balanceDisplay.textContent = GoonCoin;
  bailoutCountDisplay.textContent = bailouttime;
});

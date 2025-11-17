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
let balanceDisplay = document.getElementById("balance");
let bailoutCountDisplay = document.getElementById("bailout-count");

//On-Load Function
document.addEventListener("DOMContentLoaded", () => {
  balanceDisplay.textContent = GoonCoin;
  bailoutCountDisplay.textContent = bailouttime;
});

//Update Balance Function
function updateBalance() {
  document.getElementById("currency").textContent = GoonCoin;
  document.getElementById("bailout-count").textContent = bailouttime;
  saveGoonCoin();
  saveBailoutTime();
}

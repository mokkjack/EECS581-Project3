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

/* ======================================
 * Gacha Mechanism & Themes
 * ====================================== */

//Global Gacha Variables
const gacha_button = document.getElementById("gacha_button");
var unlocked_themes = [1, 0, 0, 0]; // 1 = UNLOCKED | 0 = LOCKED
/* add more based on themes */

//Random Number Function
function random_number_generator() {
    let rng_value = Math.floor(Math.random() * 100);
    return rng_value;
}

//Gacha Rarity Function
function rarity(number) {
  if (number < 0) return -1;        //Invalid Number
  else if (number < 61) return 1;   //Common Rarity
  else if (number < 91) return 2;   //Rare Rarity
  else if (number < 101) return 3;  //Ultra Rarity
  else return -1;                   //Invalid Number
}

//Remove Color Function
function gacha_remove_color() {
  gacha_button.classList.remove('common', 'rare', 'ultra');
}

//Gacha Color Function
function gacha_add_colors(number) {
  let rarity_color = rarity(number);

  switch (rarity_color) {
    case 1: gacha_button.classList.add("common"); 
      break;
    case 2: gacha_button.classList.add("rare");
      break;
    case 3: gacha_button.classList.add("ultra");
      break;
    default: gacha_button.classList.add("common");
  }
  return;
}

//Gacha Function
/* ================ *
 * 1-60:    Common  *
 * 61-90:   Rare    *
 * 91-100:  Ultra   *
 * ================ */
function gacha() {

  for (let i = 0; i < 10; i++) {
    let delay = i * 700;
    
    setTimeout( () => {
      let rng_value = random_number_generator();
      gacha_add_colors(rng_value);
    }, delay);

    setTimeout( () => {
      gacha_remove_color();
    }, delay + 400);
  }

  let rng_value = random_number_generator();
  gacha_add_colors(rng_value);
}


//On-Load Function
document.addEventListener("DOMContentLoaded", () => {
  balanceDisplay.textContent = GoonCoin;
  bailoutCountDisplay.textContent = bailouttime;
});

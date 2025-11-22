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



/* ======================================================================== *
 * Bail Out Functions                                                       *
 * ======================================================================== */

//Save Bail Out Time Function
function saveBailoutTime() {
  sessionStorage.setItem("bailouttime", bailouttime);
}

//Bail Out Function
function bailout() {
  if (GoonCoin === 0) {
    GoonCoin += 1000;
    bailouttime += 1;
    saveGoonCoin();
    saveBailoutTime();
    updateCurrencyDisplay();
  }
}



/* ====================================== *
 * Gacha Mechanism & Themes               *
 * ====================================== *
 * Themes:                                *
 * 0  = Default Theme                     *
 * 1  = Dark Theme                        *
 * 2  = Red Theme                         *
 * 3  = Blue Theme                        *
 * 4  = Yellow Theme                      *
 * 5  = Green Theme                       *
 * 6  = Comic-Sans Theme                  *
 * 7  = Donkey Stare Theme                *
 * 8  = Silver Theme                      *
 * 9  = Special Theme                     *
 * 10 = Minesweeper Theme                 *
 * 11 = Gold Theme                        *
 * ====================================== */

//Global Gacha Variables
const gacha_button = document.getElementById("gacha_button");
const gacha_message = document.getElementById("Shop_subtitle");
const gacha_theme_buttons = document.getElementById("theme_selector_section");

//Gacha Cost Function
function gacha_cost() {
  //Transaction Check
  if (GoonCoin - 500 >= 0) {
    gacha_message.innerHTML = "Transaction Complete!";
    setTimeout( () => {
      gacha_message.innerHTML = "SPRINT Bank Theme Store";
    }, 4000)
    //Remove GoonCoin Here
    return true;

  //Unable to Complete Transaction
  } else {
    gacha_message.innerHTML = "Can't even sub to Pokimane smh. You broke-ahh boy";
    setTimeout( () => {
      gacha_message.innerHTML = "SPRINT Bank Theme Store";
    }, 4000)
    return false;
  }
}

//Random Number Function
function random_number_generator() {
    let rng_value = Math.floor(Math.random() * 100);
    return rng_value;
}

//Unlock Checker Function
function unlock_check(array_index) {
  if (unlocked_themes[array_index] === 1) {
    console.log("duplicate");
    return;
  } else {
    unlocked_themes[array_index] = 1;

    //Unlock Theme
    let theme_buttons = gacha_theme_buttons.querySelectorAll('#Theme_Button');
    theme_buttons.forEach(button => {
      if (button.value == array_index + 1) {
        button.classList.remove('locked');
        button.classList.add('unlocked');
      }
    });

    saveThemeArray();
    console.log(unlocked_themes);
    console.log("you won!");
  }

}

//Unlock Theme Function
function unlock(number) {
  if (number < 0) return;   //Invalid Number
  else if (number < 13) {   //Dark Theme
    unlock_check(1);
  } else if (number < 25) { //Red Theme
    unlock_check(2);
  } else if (number < 37) { //Blue Theme
    unlock_check(3);
  } else if (number < 49) { //Yellow Theme
    unlock_check(4);
  } else if (number < 61) { //Green Theme
    unlock_check(5);
  } else if (number < 71) { //Theme 6
    unlock_check(6);
  } else if (number < 81) { //Theme 7
    unlock_check(7);
  } else if (number < 91) { //Silver Theme
    unlock_check(8);
  } else if (number < 95) { //Special Theme
    unlock_check(9);
  } else if (number < 98) { //Minesweeper Theme
    unlock_check(10);
  } else if (number < 101) { //Gold Theme
    unlock_check(11);
  }
  return;
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
  //Local Variable
  let final_delay = 5500; 

  //Gacha Transaction Check
  if (gacha_cost()) {
    //Gacha Button Color Change
    for (let i = 0; i < 10; i++) {
      let delay = i * 500;
      
      setTimeout( () => {
        let rng_value = random_number_generator();
        gacha_add_colors(rng_value);
      }, delay);

      setTimeout( () => {
        gacha_remove_color();
      }, delay + 400);
    }

    //Gacha Reward
    setTimeout( () => {
      let rng_value = random_number_generator();
      gacha_add_colors(rng_value);
      unlock(rng_value);
    }, final_delay);

    setTimeout( () => {
      gacha_remove_color();
    }, final_delay + 5000);
    return;

  } else {
    alert("Unable to Complete Transaction.\nReason: Not Enough Currency.");
    return;
  }
}



//On-Load Theme Unlock Function
function onload_theme_unlocker() {
  let theme_buttons = gacha_theme_buttons.querySelectorAll('#Theme_Button');
  for (let i = 0; i < 12; i++) {
    if (unlocked_themes[i] === 1) {
      theme_buttons.forEach(button => {
      if (button.value == i + 1) {
        button.classList.remove('locked');
        button.classList.add('unlocked');
      }
      });
    }
  }
}


//On-Load Function
document.addEventListener("DOMContentLoaded", () => {
  onload_theme_unlocker();
  balanceDisplay.textContent = GoonCoin;
  bailoutCountDisplay.textContent = bailouttime;
});

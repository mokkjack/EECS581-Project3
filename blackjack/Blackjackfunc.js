//Black jack game logic(work in progress)

//Golabal currency
document.addEventListener("DOMContentLoaded", () => {
  let balanceDisplay = document.getElementById("balance");
  balanceDisplay.textContent = GoonCoin;
});

function updateBalance() {
  document.getElementById("balance").textContent = GoonCoin;
}
//Card suit and value arrays
const suit = ["H","S","D","S"];
const value = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
let deck = [];

//Function to create a deck of cards
function createDeck(){
  deck = [];
  for (let s of suit){
    for (let v of value){
      let card = {suit: s, value: v};
      deck.push(card);
    }
  }
}

//Function to shuffle the deck of cards
function shuffleDeck(){
  for (let i = deck.length - 1; i > 0; i--){
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

//local variable to keep track of player's and dealer's hands
let playerHand = [];
let dealerHand = [];
let bet = 0;
let dealerHiddenCard = true; // Variable to track if dealer's card is hidden

//local variable to get button elements
const dealBtn = document.getElementById("dealBtn");
const hitBtn = document.getElementById("hitBtn");
const standBtn = document.getElementById("standBtn");
const resetBtn = document.getElementById("resetBtn");
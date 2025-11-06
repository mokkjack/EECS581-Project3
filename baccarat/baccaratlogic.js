//baccarat.js

/* EECS 581: Group 21 Project 3
 * The JavaScript Section for baccurat
 * of Codesino.
 */
const decks = 5 
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

document.addEventListener("DOMContentLoaded", () => {
  let balanceDisplay = document.getElementById("balance");
  balanceDisplay.textContent = GoonCoin;
  playBtn.addEventListener("click", BaccaratGameGame);
  playBtn.disabled = true;
});

function updateBalance() {
  document.getElementById("balance").textContent = GoonCoin;
  saveGoonCoin();
}

class Shoe {
    constructor() {
        this.cards = [];
        this.build();
        this.shuffle();
    }

    build() {
        this.cards = [];
        for (let d = 0; d < decks; d++) {
            for (const suit of suits) {
                for (const value of values) {
                    this.cards.push({ suit, value });
                }
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    deal() {
        if (this.cards.length === 0) {
            this.build();
            this.shuffle();
        }
        return this.cards.pop();
    }
}

class BaccaratGame {
    bet = parseInt(document.getElementById("bet").value);
    if (isNaN(bet) || bet <= 0 || bet > GoonCoin) {
        alert("Invalid bet amount!");
        return;
    }
    GoonCoin -= bet;
    updateBalance();

    score(hand) {

    }

    thirdcard() {

    }

    winner() {

    }

    game() {

    }
}

class Betting {
    placeBet(type, amount){

    }

    Payout(winner){

    }
    
    clearBet(){

    }

    doubleBet(){

    }
}
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
    bet = parseInt(document.getElementById("playerBet").value);
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
    
    //clearBet(){}

    //doubleBet(){}
}

function updateDisplay(){
  //get the html element id of player card and dealer card section
  const playerCardsDiv = document.getElementById("player-cards");
  const dealerCardsDiv = document.getElementById("dealer-cards");
  //get the inner html element of player and dealer card section
  playerCardsDiv.innerHTML = "";
  dealerCardsDiv.innerHTML = "";

  const suitMap = {
    'Hearts': 'Hearts',
    'Spades': 'Spades',
    'Diamonds': 'Diamonds',
    'Clubs': 'Clubs'
  };
  for (let card of playerHand){
    const img = document.createElement("img");
    img.src = `../images/Cards/card${suitMap[card.suit]}${card.value}.png`;
    img.classList.add("card");
    playerCardsDiv.appendChild(img);
  }
  dealerHand.forEach((card, index) => {
  const img = document.createElement("img");
    img.classList.add("card");
    dealerCardsDiv.appendChild(img);
  });
  document.getElementById("player-score").textContent = "Score: " + getScore(playerHand);
  if (dealerHiddenCard) {
    document.getElementById("dealer-score").textContent = "Score: ?";
  } else {
    document.getElementById("dealer-score").textContent = "Score: " + getScore(dealerHand);
  }
}

function getScore(hand){
    let score = 0; 
    for (let card of hand) {
        if (["Jack", "Queen", "King"].includes(card.value)) score += 10;
        elif ("Ace".includes(card.value)){
            score += 1;
        }else score += parseInt(card.value);
    }
    return score % 10;
}

function goBack() {
    sessionStorage.setItem("GoonCoin", GoonCoin);
    window.location.href = "../default.html";
}
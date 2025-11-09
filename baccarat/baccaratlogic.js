//baccarat.js

/* EECS 581: Group 21 Project 3
 * The JavaScript Section for baccurat
 * of Codesino.
 */
const decks = 5 
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

//game vars
let playerHand = [];
let bankerHand = [];
letcurrentBet = 0;
let betType = '';

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
    constructor() {
        this.Shoe = new Shoe();
        this.playerHand = [];
        this.bankerHand = [];
        this.betAmount = 0;
        this.betType = '';
    }

    static score(hand) {
        let score = 0;
        for (let card of hand) {
            if (["Jack", "Queen", "King", "10"].includes(card.value)) {
                score += 0;
            } else if ("Ace" === card.value) {
                score += 1;
            } else {
                score += parseInt(card.value);
        }
    }
    return score % 10;
    }

  
    static needsThirdCard(hand, score, isPlayer, bankerThirdCardValue) {
        if (hand.length === 2) {
        if (isPlayer) {
            // Player draws third card if score is 0-5
            return score <= 5;
        } else {
            // Banker drawing rules are more complex
            if (score <= 2) return true;
            if (score === 3 && bankerThirdCardValue !== 8) return true;
            if (score === 4 && bankerThirdCardValue >= 2 && bankerThirdCardValue <= 7) return true;
            if (score === 5 && bankerThirdCardValue >= 4 && bankerThirdCardValue <= 7) return true;
            if (score === 6 && bankerThirdCardValue >= 6 && bankerThirdCardValue <= 7) return true;
        }
        }
        return false;
    }

    determineWinner() {
        const playerScore = BaccaratGame.score(this.playerHand);
        const bankerScore = BaccaratGame.score(this.bankerHand);
        
        if (playerScore > bankerScore) return 'player';
        if (bankerScore > playerScore) return 'banker';
        return 'tie';
    } 
    playGame(betAmount, betType) {
        this.betAmount = betAmount;
        this.betType = betType;
        
        // Deal initial cards
        this.playerHand = [this.shoe.deal(), this.shoe.deal()];
        this.bankerHand = [this.shoe.deal(), this.shoe.deal()];
        
        let playerScore = BaccaratGame.score(this.playerHand);
        let bankerScore = BaccaratGame.score(this.bankerHand);
        
        // Check if player needs third card
        let playerThirdCard = null;
        if (BaccaratGame.needsThirdCard(this.playerHand, playerScore, true)) {
            playerThirdCard = this.shoe.deal();
            this.playerHand.push(playerThirdCard);
            playerScore = BaccaratGame.score(this.playerHand);
        }
        
        // Check if banker needs third card
        const playerThirdCardValue = playerThirdCard ? 
        (["Jack", "Queen", "King", "10"].includes(playerThirdCard.value) ? 0 : "Ace" === playerThirdCard.value ? 1 : parseInt(playerThirdCard.value)) : -1;
        
        if (BaccaratGame.needsThirdCard(this.bankerHand, bankerScore, false, playerThirdCardValue)) {
            this.bankerHand.push(this.shoe.deal());
            bankerScore = BaccaratGame.score(this.bankerHand);
        }
        
        return this.determineWinner();
    }
  /*
    bet = parseInt(document.getElementById("playerBet").value);
    if (isNaN(bet) || bet <= 0 || bet > GoonCoin) {
        alert("Invalid bet amount!");
        return;
    }
    GoonCoin -= bet;
  */
}

class Betting {
    static placeBet(type, amount){
        if (amount <= 0 || amount  > GoonCoin) {
            return false;
        }
        GoonCoin -= amount;
        updateBalence();
        return true;
    }

    Payout(winner, betType, betAmount){
        let multiplier = 0;
        if (winner === betType){
            if (winner === tie) {
                multiplier = 8;
            }
            else{
                multiplier = 1;
            }
        }
        const winnings = betAmount + (betAmount * multiplier);
        GoonCoin += winnings;
        updateBalence();

        return winnings;

    }
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
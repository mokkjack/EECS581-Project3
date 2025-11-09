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
let currentBet = 0;
let betType = '';
let game

document.addEventListener("DOMContentLoaded", () => {
  let balanceDisplay = document.getElementById("balance");
  balanceDisplay.textContent = GoonCoin;

  let playBtn = document.getElementById("playBtn");
  playBtn.addEventListener("click", startGame);
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
        this.shoe = new Shoe();
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
    playGame() {
        //get inputs
        const playerBetAmount = parseInt(document.getElementById("playerBet").value) || 0;
        const bankerBetAmount = parseInt(document.getElementById("bankerBet").value) || 0;
        const tieBetAmount = parseInt(document.getElementById("tieBet").value) || 0;
        
        const totalBet = playerBetAmount + bankerBetAmount + tieBetAmount;
        
        if (totalBet <= 0 || totalBet > GoonCoin) {
            alert("Invalid bet amount!");
            return null;
        }
        
        //bets
        if (playerBetAmount > 0) Betting.placeBet('player', playerBetAmount);
        if (bankerBetAmount > 0) Betting.placeBet('banker', bankerBetAmount);
        if (tieBetAmount > 0) Betting.placeBet('tie', tieBetAmount);

        //deal 2
        this.playerHand = [this.shoe.deal(), this.shoe.deal()];
        this.bankerHand = [this.shoe.deal(), this.shoe.deal()];
        
        let playerScore = BaccaratGame.score(this.playerHand);
        let bankerScore = BaccaratGame.score(this.bankerHand);
        
        //3rd check player
        let playerThirdCard = null;
        if (BaccaratGame.needsThirdCard(this.playerHand, playerScore, true)) {
            playerThirdCard = this.shoe.deal();
            this.playerHand.push(playerThirdCard);
            playerScore = BaccaratGame.score(this.playerHand);
        }
        
        //3rd banker check
        const playerThirdCardValue = playerThirdCard ? 
            (["Jack", "Queen", "King", "10"].includes(playerThirdCard.value) ? 0 : 
             "Ace" === playerThirdCard.value ? 1 : parseInt(playerThirdCard.value)) : -1;
        
        if (BaccaratGame.needsThirdCard(this.bankerHand, bankerScore, false, playerThirdCardValue)) {
            this.bankerHand.push(this.shoe.deal());
            bankerScore = BaccaratGame.score(this.bankerHand);
        }
        
        const winner = this.determineWinner();
        
        //payout
        if (playerBetAmount > 0) {
            Betting.Payout(winner, 'player', playerBetAmount);
        }
        if (bankerBetAmount > 0) {
            Betting.Payout(winner, 'banker', bankerBetAmount);
        }
        if (tieBetAmount > 0) {
            Betting.Payout(winner, 'tie', tieBetAmount);
        }
        
        return winner;
    }
}

class Betting {
    static placeBet(type, amount){
        if (amount <= 0 || amount  > GoonCoin) {
            return false;
        }
        GoonCoin -= amount;
        updateBalance();
        return true;
    }

    static Payout(winner, betType, betAmount){
        let multiplier = 0;
        if (winner === betType){
            if (winner === 'tie') {
                multiplier = 8;
            }
            else{
                multiplier = 1;
            }
        }
        const winnings = betAmount + (betAmount * multiplier);
        GoonCoin += winnings;
        updateBalance();

        return winnings;

    }
}

function updateDisplay(){
    const playerCardsDiv = document.getElementById("playerCards .cardRow");
    const dealerCardsDiv = document.getElementById("dealerCards");
    const playerScoreDiv = document.getElementById("playerScore");
    const dealerScoreDiv = document.getElementById("dealerScore");

    playerCardsDiv.innerHTML = "";
    dealerCardsDiv.innerHTML = "";

    const suitMap = {
        'Hearts': 'Hearts',
        'Spades': 'Spades',
        'Diamonds': 'Diamonds',
        'Clubs': 'Clubs'
    };
    //display player cards and score
    playerHand.forEach(card => {
        const img = document.createElement("img");
        img.src = `../images/Cards/card${card.suit}${card.value}.png`;
        img.classList.add("card");
        playerCardsDiv.appendChild(img);
    });
    
    const playerScore = BaccaratGame.score(playerHand);
    playerScoreDiv.textContent = `Score: ${playerScore}`;
    
    //display banker cards and score
    bankerHand.forEach(card => {
        const img = document.createElement("img");
        img.src = `../images/Cards/card${card.suit}${card.value}.png`;
        img.classList.add("card");
        dealerCardsDiv.appendChild(img);
    });
    
    const bankerScore = BaccaratGame.score(bankerHand);
    dealerScoreDiv.textContent = `Score: ${bankerScore}`;
}

function startGame(){
    playerHand = [];
    bankerHand = [];

    game = new BaccaratGame();

    const winner = game.playGame();

    if (winner){
        playerHand = game.playerHand
        bankerHand = game.bankerHand

        updateDisplay();

        setTimeout(() => {
            alert(`Game Over! Winner: ${winner.toUpperCase()}\nYour balance: $${GoonCoin}`);
        }, 500);
    }
}

function getScore(hand){
    let score = 0; 
    for (let card of hand) {
        if (["Jack", "Queen", "King"].includes(card.value)) score += 10;
        else if ("Ace".includes(card.value)){
            score += 1;
        }else{ 
            score += parseInt(card.value);
        }
    }
    return score % 10;
}

function goBack() {
    sessionStorage.setItem("GoonCoin", GoonCoin);
    window.location.href = "../default.html";
}
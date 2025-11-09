//baccarat.js
/* EECS 581: Group 21 Project 3
 * The JavaScript Section for baccurat
 * of Codesino.
 */
const decks = 5 
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

//game vars
let playerHand = [];
let bankerHand = [];
let currentBet = 0;
let betType = '';
let game;

function updateBalance() { //Update balance display
    document.getElementById("balance").textContent = GoonCoin; //Update balance display
    saveGoonCoin(); //Save updated balance
}

document.addEventListener("DOMContentLoaded", () => {
  let balanceDisplay = document.getElementById("balance");
  balanceDisplay.textContent = GoonCoin;

  let playBtn = document.getElementById("playBtn");
  playBtn.addEventListener("click", startGame);

  let backBtn = document.getElementById("backBtn");
  backBtn.addEventListener("click", goBack);
});

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
            if (["J", "Q", "K", "10"].includes(card.value)) {
                score += 0;
            } else if ("A" === card.value) {
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
                return score <= 5;
            } else {
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
        this.clearResult();
        
        const playerBetAmount = parseInt(document.getElementById("playerBetInput").value) || 0;
        const bankerBetAmount = parseInt(document.getElementById("bankerBetInput").value) || 0;
        const tieBetAmount = parseInt(document.getElementById("tieBetInput").value) || 0;
        
        const totalBet = playerBetAmount + bankerBetAmount + tieBetAmount;
        
        if (isNaN(totalBet) || totalBet <= 0) {
            this.showResult("Please enter a valid bet amount!", "error");
            return null;
        }

        if (totalBet > GoonCoin) {
            this.showResult(`Insufficient balance! You only have ${GoonCoin} GoonCoins.`, "error");
            return null;
        }

        GoonCoin -= totalBet; //remove bet from total
        updateBalance();
        
        this.playerHand = [this.shoe.deal(), this.shoe.deal()];
        this.bankerHand = [this.shoe.deal(), this.shoe.deal()];
        
        let playerScore = BaccaratGame.score(this.playerHand);
        let bankerScore = BaccaratGame.score(this.bankerHand);
        
        let playerThirdCard = null;
        if (BaccaratGame.needsThirdCard(this.playerHand, playerScore, true)) {
            playerThirdCard = this.shoe.deal();
            this.playerHand.push(playerThirdCard);
            playerScore = BaccaratGame.score(this.playerHand);
        }
        
        const playerThirdCardValue = playerThirdCard ? 
            (["J", "Q", "K", "10"].includes(playerThirdCard.value) ? 0 : 
             "A" === playerThirdCard.value ? 1 : parseInt(playerThirdCard.value)) : -1;
        
        if (BaccaratGame.needsThirdCard(this.bankerHand, bankerScore, false, playerThirdCardValue)) {
            this.bankerHand.push(this.shoe.deal());
            bankerScore = BaccaratGame.score(this.bankerHand);
        }
        
        const winner = this.determineWinner();
        
        //winning vars
        let totalWinnings = 0;
        let winMessage = "";
        
        if (winner === 'tie') {
            //push for player/banker on tie
            totalWinnings += playerBetAmount; 
            totalWinnings += bankerBetAmount; 
            if (tieBetAmount > 0) {
                totalWinnings += tieBetAmount * 9; //tie payout
            }
        } else {
            //playerwin
            if (playerBetAmount > 0) {
                if (winner === 'player') {
                    totalWinnings += playerBetAmount * 2;
                }
            }
            //bankerwin
            if (bankerBetAmount > 0) {
                if (winner === 'banker') {
                    totalWinnings += bankerBetAmount * 2;
                }
            }

        }
        
        //add winnings to total
        if (totalWinnings > 0) {
            GoonCoin += totalWinnings;
            updateBalance();
        }
        //win message
        const resultMessage = `Winner: ${winner.toUpperCase()}! Your balance: ${GoonCoin} GoonCoins`;
        this.showResult(resultMessage, winner);
        
        return winner;
    }

    showResult(message, type) {
        const resultDiv = document.getElementById("gameResult");
        if (!resultDiv) return;
        
        resultDiv.textContent = message;
        resultDiv.className = "game-result " + type;
        resultDiv.style.display = "block";
        

    }

    clearResult() {
        const resultDiv = document.getElementById("gameResult");
        if (resultDiv) {
            resultDiv.style.display = "none";
            resultDiv.textContent = "";
            resultDiv.className = "game-result";
        }
    }
}

function updateDisplay(){
    const playerCardsDiv = document.getElementById("playerCards");
    const dealerCardsDiv = document.getElementById("dealerCards");
    const playerScoreDiv = document.getElementById("playerScore");
    const dealerScoreDiv = document.getElementById("dealerScore");

    if (playerCardsDiv) playerCardsDiv.innerHTML = "";
    if (dealerCardsDiv) dealerCardsDiv.innerHTML = "";

    if (playerHand && playerCardsDiv) {
        playerHand.forEach(card => {
            const img = document.createElement("img");
            img.src = `../images/Cards/card${card.suit}${card.value}.png`;
            img.classList.add("card");
            playerCardsDiv.appendChild(img);
        });
    }
    
    if (playerScoreDiv) {
        const playerScore = BaccaratGame.score(playerHand);
        playerScoreDiv.textContent = `Score: ${playerScore}`;
    }
    
    if (bankerHand && dealerCardsDiv) {
        bankerHand.forEach(card => {
            const img = document.createElement("img");
            img.src = `../images/Cards/card${card.suit}${card.value}.png`;
            img.classList.add("card");
            dealerCardsDiv.appendChild(img);
        });
    }
    
    if (dealerScoreDiv) {
        const bankerScore = BaccaratGame.score(bankerHand);
        dealerScoreDiv.textContent = `Score: ${bankerScore}`;
    }
}

function startGame(){
    playerHand = [];
    bankerHand = [];

    game = new BaccaratGame();

    const winner = game.playGame();

    if (winner === null){
        return;
    }

    if (winner){
        playerHand = game.playerHand;
        bankerHand = game.bankerHand;

        updateDisplay();
    }
}

function getScore(hand){
    let score = 0; 
    for (let card of hand) {
        if (["J", "Q", "K"].includes(card.value)) score += 10;
        else if ("A".includes(card.value)){
            score += 1;
        }else{ 
            score += parseInt(card.value);
        }
    }
    return score % 10;
}

//Function to navigate back to homepage
function goBack() {
    sessionStorage.setItem("GoonCoin", GoonCoin);
    // Navigate and force reload so homepage reads the latest GoonCoin
    window.location.href = "../default.html";
}
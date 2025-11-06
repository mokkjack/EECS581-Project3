//Black jack game logic(work in progress)
//Global currency
document.addEventListener("DOMContentLoaded", () => {
  let balanceDisplay = document.getElementById("balance");
  balanceDisplay.textContent = GoonCoin;
  // assign buttons after DOM is ready and attach listeners
  dealBtn = document.getElementById("dealBtn");
  hitBtn = document.getElementById("hitBtn");
  standBtn = document.getElementById("standBtn");
  resetBtn = document.getElementById("resetBtn");

  dealBtn.addEventListener("click", startGame);
  hitBtn.addEventListener("click", hit);
  standBtn.addEventListener("click", stand);
  resetBtn.addEventListener("click", resetGame);

  // initial states
  dealBtn.disabled = false;
  hitBtn.disabled = true;
  standBtn.disabled = true;
});

function updateBalance() {
  document.getElementById("balance").textContent = GoonCoin;
  saveGoonCoin();
}
//Card suit and value arrays
const suit = ["H","C","D","S"];
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
let dealBtn, hitBtn, standBtn, resetBtn; // was const ... moved assignment into DOMContentLoaded

//Function to start the game
function startGame(){
  bet = parseInt(document.getElementById("bet").value);
  if (isNaN(bet) || bet <= 0 || bet > GoonCoin) {
    alert("Invalid bet amount!");
    return;
  }
  GoonCoin -= bet;
  updateBalance();
  createDeck();
  shuffleDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  dealerHiddenCard = true;
  updateDisplay();
  dealBtn.disabled = true;
  hitBtn.disabled = false;
  standBtn.disabled = false;
  resetBtn.disabled = true;
  if (getScore(playerHand) === 21){
    stand();
  }
}
//function to handle player hitting
function hit(){
  playerHand.push(deck.pop());
  updateDisplay();
  if (getScore(playerHand) > 21){
    endRound("lose");
  }else if (getScore(playerHand) === 21){
    stand();
  }
}
//function to handle player standing
function stand(){
  dealerHiddenCard = false;
  while (getScore(dealerHand) < 17 || getScore(playerHand) > getScore(dealerHand)){
    dealerHand.push(deck.pop());
  }
  updateDisplay();
  
  const playerScore = getScore(playerHand);
  const dealerScore = getScore(dealerHand);
  
  if (dealerScore > 21 || playerScore > dealerScore) {
    endRound("win");
  } else if (playerScore < dealerScore) {
    endRound("lose");
  } else {
    endRound("push");
  }
}
//function to reset the game
function resetGame(){
  playerHand = [];
  dealerHand = [];
  dealerHiddenCard = true;
  document.getElementById("player-cards").innerHTML = "";
  document.getElementById("dealer-cards").innerHTML = "";
  document.getElementById("player-score").textContent = "";
  document.getElementById("dealer-score").textContent = "";
  clearMessage();
  dealBtn.disabled = false;
  hitBtn.disabled = true;
  standBtn.disabled = true;
  resetBtn.disabled = false;
}

//Function to update the display of cards
function updateDisplay(){
  const playerCardsDiv = document.getElementById("player-cards");
  const dealerCardsDiv = document.getElementById("dealer-cards");
  playerCardsDiv.innerHTML = "";
  dealerCardsDiv.innerHTML = "";

  const suitMap = {
    'H': 'Hearts',
    'S': 'Spades',
    'D': 'Diamonds',
    'C': 'Clubs'
  };

  for (let card of playerHand){
    const img = document.createElement("img");
    img.src = `../images/Cards/card${suitMap[card.suit]}${card.value}.png`;
    img.classList.add("card");
    playerCardsDiv.appendChild(img);
  }
  dealerHand.forEach((card, index) => {
  const img = document.createElement("img");
  if (dealerHiddenCard && index === 0) {
      img.src = "../images/Cards/cardBack_blue3.png";
  } else {
      img.src = `../images/Cards/card${suitMap[card.suit]}${card.value}.png`;
    }
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
//Function to calculate the score of a hand
function getScore(hand){
  let score = 0;
  let ace = 0;
  for (let card of hand) {
    if (["J", "Q", "K"].includes(card.value)) score += 10;
    else if (card.value === "A") {
      ace++;
      score += 11;
    } else score += parseInt(card.value);
  }
  while (score > 21 && ace > 0) {
    score -= 10;
    ace--;
  }
  return score;
}
//Function to handle end of round
function endRound(result){
  dealerHiddenCard = false;
  updateDisplay();
  if (result === "win") {
    GoonCoin += bet * 2;
    showMessage("You win!");
  } else if (result === "lose") {
    showMessage("You lose!");
  } else {
    GoonCoin += bet;
    showMessage("Push!");
  }
  updateBalance();
  dealBtn.disabled = true;
  hitBtn.disabled = true;
  standBtn.disabled = true;
  resetBtn.disabled = false;
}
//Function to show messages to the player
function showMessage(msg){
  document.getElementById("message-area").textContent = msg;
}
//Function to clear messages
function clearMessage(){
  document.getElementById("message-area").textContent = "";
}
//Function to navigate back to homepage
function goBack() {
    sessionStorage.setItem("GoonCoin", GoonCoin);
    // Navigate and force reload so homepage reads the latest GoonCoin
    window.location.href = "../default.html";
}
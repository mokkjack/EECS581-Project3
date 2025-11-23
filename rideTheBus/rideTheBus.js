/* ======================================================================== *
 * Prologue Comments for home_func.js                                       *
 * File Name: home_func.js                                                  *
 * Authors: Ian Foehrweiser                                                 *
 * EECS 581: Group 21 Project 3                                             *
 * ------------------------------------------------------------------------ *
 * Code-sino Ride the bus game                                              *
 * Inputs/Outputs                                                           *
 *  Inputs:     Gooncoin from main page                                     *
 *  Outputs:    Game graphics                                               *
 *                                                                          *
 *  Purpose:    Implement the ride the bus round based game                 *
 *                                                                          *
 *                                                                          *
 *                                                                          *
 * ======================================================================== */


const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
const valueRank = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6,
  '7': 7, '8': 8, '9': 9, '10': 10,
  'Jack': 11, 'Queen': 12, 'King': 13, 'Ace': 14
};

let deck = [];
let drawnCards = [];
let round = 0;
let betAmount = 0;
let winnings = 0;

window.onload = function() {
  deck = createDeck();
  shuffleDeck(deck);

  document.getElementById("startGame").addEventListener("click", startGame);
};

function createDeck() {
  const newDeck = [];
  for (let suit of suits) {
    for (let value of values) {
      newDeck.push({ suit, value });
    }
  }
  return newDeck;
}

function shuffleDeck(d) {
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
}

function drawCard() {
  if (deck.length === 0) {
    deck = createDeck();
    shuffleDeck(deck);
  }
  return deck.pop();
}

function startGame() {
  betAmount = parseFloat(document.getElementById("betAmount").value);

  if (isNaN(betAmount) || betAmount <= 0) {
    alert("Enter a valid bet amount.");
    return;
  }

  if (betAmount > GoonCoin) {
    alert("You don't have enough GoonCoin!");
    return;
  }

  // Deduct bet
  setGoonCoin(GoonCoin - betAmount);

  winnings = betAmount;
  round = 1;
  drawnCards = [];
  document.getElementById('card-field-1').innerHTML = "";
  updateBusPosition();
  
  document.getElementById("result").textContent = "";
  document.getElementById("instructions").textContent =
    "Round 1: Guess the color (Red or Black)";
  showButtons(["Red", "Black"]);
  document.getElementById("startGame").hidden = true;
}

function showButtons(options) {
  const container = document.getElementById("buttons");
  container.innerHTML = "";
  for (let opt of options) {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.addEventListener("click", () => handleChoice(opt));
    container.appendChild(btn);
  }

  // Early exit option for rounds 2–3 only
  if (round > 1 && round < 4) {
    const exitBtn = document.createElement("button");
    exitBtn.textContent = `Exit Early (Collect $${winnings.toFixed(2) *0.75})`;
    exitBtn.addEventListener("click", () => endGame(false));
    container.appendChild(exitBtn);
  }
}

function displayCard(card) {
  const cardField = document.getElementById("card-field-1");

  const img = document.createElement("img");
  const valueLetter = getValueLetter(card.value);
  img.src = `../images/Cards/card${card.suit}${valueLetter}.png`;
  img.alt = `${card.value} of ${card.suit}`;
  img.style.width = "150px";
  img.style.border = "2px solid black";
  img.style.borderRadius = "10px";
  img.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  img.style.margin = "5px";

  cardField.appendChild(img);
}

function getValueLetter(value) { // this was easier than creating a new image set
  if (["Jack", "Queen", "King", "Ace"].includes(value)) {
    return value.charAt(0); // J, Q, K, A
  }
  return value; // 2–10
}

function handleChoice(choice) {
  const card = drawCard();
  drawnCards.push(card);
  displayCard(card);

  let correct = false;

  if (round === 1) {
    const isRed = card.suit === "Hearts" || card.suit === "Diamonds";
    correct = (choice === "Red" && isRed) || (choice === "Black" && !isRed);
    winnings *= 2;
    nextRound(correct, "Round 2: Higher or Lower than last card?", ["Higher", "Lower"]);
  }

  else if (round === 2) {
    const prevCard = drawnCards[0];
    const prevVal = valueRank[prevCard.value];
    const newVal = valueRank[card.value];
    if (choice === "Higher") correct = newVal > prevVal;
    if (choice === "Lower") correct = newVal < prevVal;
    winnings *= 3;
    nextRound(correct, "Round 3: Inside or Outside the first two cards?", ["Inside", "Outside"]);
  }

  else if (round === 3) {
    const [c1, c2] = drawnCards;
    const low = Math.min(valueRank[c1.value], valueRank[c2.value]);
    const high = Math.max(valueRank[c1.value], valueRank[c2.value]);
    const newVal = valueRank[card.value];
    if (choice === "Inside") correct = newVal > low && newVal < high;
    if (choice === "Outside") correct = newVal < low || newVal > high;
    winnings *= 4;
    nextRound(correct, "Round 4: Guess the suit!", suits);
  }

  else if (round === 4) {
    correct = card.suit === choice;
    winnings *= 20; 
    endGame(true, correct);
  }
}

function nextRound(correct, nextText, nextOptions) {
  const instructionTag = document.getElementById("instructions");
  if (!correct) {
    instructionTag.textContent = "Wrong! You lost your bet.";
    document.getElementById("buttons").innerHTML = "";
    document.getElementById("startGame").hidden = false;
    return;
  }
  round++;
  updateBusPosition();
  instructionTag.textContent = nextText;
  showButtons(nextOptions);
}

function endGame(final = true, success = true) {
  let payout = 0;

  if (final && success) {
    payout = Math.floor(winnings);
  }
  else if (!final) {
    payout = Math.floor(winnings * 0.75);
  }

  if (payout > 0) {
    setGoonCoin(GoonCoin + payout);
  }

  document.getElementById("result").textContent =
    payout > 0 ? `You won ${payout} GoonCoin!` : "You lost your bet.";

  const buttons = document.getElementById("buttons");
  buttons.innerHTML = "";

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Play Again";
  restartBtn.addEventListener("click", startGame);
  buttons.appendChild(restartBtn);
}

function updateBusPosition() {
  const bus = document.getElementById("bus-icon");

  // Rounds go 1 → 4, so map that to 0% → 100%
  const percentages = {
    1: 0,
    2: 33,
    3: 66,
    4: 100
  };

  bus.style.left = percentages[round] + "%";
}

function getGoonCoin() {
    return GoonCoin; // uses the global from home_func.js
}

function setGoonCoin(amount) {
    GoonCoin = amount;
    saveGoonCoin();
    updateCurrencyDisplay();
}
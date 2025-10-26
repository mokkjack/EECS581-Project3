const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

let deck = []; // global deck variable

window.onload = function() {
  deck = createDeck();
  shuffleDeck(deck);

  const drawCardButton = document.getElementById("cardDraw");
  drawCardButton.addEventListener('click', drawCard);
};

function createDeck() {
  const newDeck = [];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < values.length; j++) {
      newDeck.push({ suit: suits[i], value: values[j] });
    }
  }
  return newDeck;
}

function shuffleDeck(d) {
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function drawCard() {
  if (!deck || deck.length === 0) {
    const pTag = document.getElementById("card-field-1");
    pTag.textContent = "Deck is empty!";
    return null;
  }

  const card = deck.pop();
  const pTag = document.getElementById("card-field-1");
  pTag.textContent = `${card.value} of ${card.suit}`; // human readable
  return card;
}
//Black jack game logic(work in progress)

//Golabal currency
document.addEventListener("DOMContentLoaded", () => {
  let balanceDisplay = document.getElementById("balance");
  balanceDisplay.textContent = GoonCoin;
});

function updateBalance() {
  document.getElementById("balance").textContent = GoonCoin;
}
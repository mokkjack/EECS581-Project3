document.addEventListener("DOMContentLoaded", () => {
let balanceDisplay = document.getElementById("balance");
balanceDisplay.textContent = GoonCoin;
let bailoutCountDisplay = document.getElementById("bailout-count");
bailoutCountDisplay.textContent = bailouttime;
});

function updateBalance() {
  document.getElementById("currency").textContent = GoonCoin;
  document.getElementById("bailout-count").textContent = bailouttime;
  saveGoonCoin();
  saveBailoutTime();
}

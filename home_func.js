var bailouttime = 0;

// Global GoonCoin
var GoonCoin = sessionStorage.getItem("GoonCoin");
if (GoonCoin === null) {
    GoonCoin = 1000;
    sessionStorage.setItem("GoonCoin", GoonCoin);
} else {
    GoonCoin = parseInt(GoonCoin);
}

// Save GoonCoin to sessionStorage
function saveGoonCoin() {
    sessionStorage.setItem("GoonCoin", GoonCoin);
}

// Bailout function
function bailout() {
    if (GoonCoin === 0) {
        GoonCoin += 1000;
        bailouttime += 1;
        saveGoonCoin();
        updateCurrencyDisplay();
    }
}

// Update homepage currency display
function updateCurrencyDisplay() {
    const currencyElement = document.getElementById("currency");
    if (currencyElement) {
        let stored = sessionStorage.getItem("GoonCoin");
        GoonCoin = stored !== null ? parseInt(stored) : 1000;
        currencyElement.textContent = GoonCoin;
    }
}

// Called on initial load
window.addEventListener("load", () => {
    updateCurrencyDisplay();
});

// Also update when page is shown from bfcache (back button)
window.addEventListener("pageshow", () => {
    updateCurrencyDisplay();
});
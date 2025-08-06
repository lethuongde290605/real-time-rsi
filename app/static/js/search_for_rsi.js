// static/js/search_for_rsi.js

let allRSIPairs = [];

function openRSISearchModal() {
  const modal = document.getElementById("rsi-search-modal");
  modal.classList.remove("hidden");
  modal.classList.add("show");

  const input = document.getElementById("rsiSearchInput");
  const results = document.getElementById("rsiSearchResults");
  input.value = "";
  results.innerHTML = "";

  if (allRSIPairs.length === 0) {
    loadBinancePairs(); // chỉ gọi lần đầu
  } else {
    renderFilteredRSIPairs(""); // hiển thị tất cả
  }

  input.focus();
}

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("rsiCloseSearchBtn");
  if (closeBtn) {
    closeBtn.onclick = () => {
      const modal = document.getElementById("rsi-search-modal");
      modal.classList.add("hidden");
      modal.classList.remove("show");
    };
  }

  const input = document.getElementById("rsiSearchInput");
  input.addEventListener("input", () => {
    const keyword = input.value.trim().toLowerCase();
    renderFilteredRSIPairs(keyword);
  });
});

async function loadBinancePairs() {
  const spinner = document.getElementById("rsiLoadingSpinner");
  const results = document.getElementById("rsiSearchResults");
  spinner.classList.remove("d-none");

  try {
    const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
    const data = await res.json();
    allRSIPairs = data.symbols.filter(s => s.status === "TRADING");
    renderFilteredRSIPairs("");
  } catch (err) {
    console.error("❌ Không thể lấy dữ liệu Binance:", err);
    results.innerHTML = "<p class='text-danger'>Không thể tải dữ liệu!</p>";
  } finally {
    spinner.classList.add("d-none");
  }
}

function renderFilteredRSIPairs(keyword = "") {
  const results = document.getElementById("rsiSearchResults");
  results.innerHTML = "";

  const filtered = allRSIPairs.filter(symbol => {
    const text = `${symbol.symbol} ${symbol.baseAsset}/${symbol.quoteAsset}`.toLowerCase();
    return text.includes(keyword);
  });

  if (filtered.length === 0) {
    results.innerHTML = "<p class='text-muted'>Không tìm thấy cặp phù hợp.</p>";
    return;
  }

  for (const symbol of filtered) {
    const div = document.createElement("div");
    div.className = "search-result-item";
    div.innerHTML = `
      <div class="token-info">
        <div class="token-meta">
          <div class="pair-name">${symbol.symbol}</div>
          <div class="pair-address">${symbol.baseAsset}/${symbol.quoteAsset}</div>
        </div>
      </div>
      <button class="btn-watchlist">➕</button>
    `;
    div.onclick = () => {
      document.getElementById("tokenInput").value = `${symbol.baseAsset}/${symbol.quoteAsset}`;
      const modal = document.getElementById("rsi-search-modal");
      modal.classList.add("hidden");
      modal.classList.remove("show");
      handleAddChart();
    };
    results.appendChild(div);
  }
}

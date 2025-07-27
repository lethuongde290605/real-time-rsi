// ✅ search.js (kết nối Dexscreener API + lưu Watchlist + mở Modal từ Sidebar)

let timeout = null;

// Lấy các phần tử trong DOM
const modal = document.getElementById("search-modal");
const input = document.getElementById("searchInput");
const resultBox = document.getElementById("searchResults");
const openBtn = document.getElementById("openSearchModal");
const closeBtn = document.getElementById("closeSearchBtn");
const clearBtn = document.getElementById("clearSearch");
const spinner = document.getElementById("loadingSpinner");

// ✅ Mở modal khi click vào nút trên sidebar
openBtn.onclick = (e) => {
  e.preventDefault(); // Ngăn reload
  modal.classList.remove("hidden");
  modal.classList.add("show");
  input.value = "";
  resultBox.innerHTML = "";
  input.focus();
};

// ✅ Đóng modal
closeBtn.onclick = () => {
  modal.classList.remove("show");
  modal.classList.add("hidden");
};

// ✅ Clear ô input
clearBtn.onclick = () => {
  input.value = "";
  input.dispatchEvent(new Event("input"));
};

// ✅ Sự kiện tìm kiếm khi người dùng nhập
input.addEventListener("input", () => {
  clearTimeout(timeout);
  const query = input.value.trim();

  if (!query) {
    resultBox.innerHTML = "";
    spinner.classList.add("d-none");
    return;
  }

  spinner.classList.remove("d-none");

  timeout = setTimeout(() => {
    fetch(`https://api.dexscreener.com/latest/dex/search/?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        renderSearchResults(data.pairs || []);
      })
      .catch(() => {
        resultBox.innerHTML = `<div class='text-danger p-3'>❌ Lỗi kết nối API Dexscreener.</div>`;
      })
      .finally(() => {
        spinner.classList.add("d-none");
      });
  }, 400);
});

// ✅ Hiển thị kết quả tìm kiếm
function renderSearchResults(pairs) {
  if (pairs.length === 0) {
    resultBox.innerHTML = `<div class='text-muted p-3'>Không tìm thấy kết quả.</div>`;
    return;
  }

  resultBox.innerHTML = pairs.slice(0, 10).map(pair => {
    const base = pair.baseToken || {};
    const quote = pair.quoteToken || {};
    const price = parseFloat(pair.priceUsd).toFixed(4);
    const vol = parseFloat(pair.volume?.h24 || 0).toLocaleString();
    const chain = pair.chainId || pair.chain || "-";
    const address = pair.pairAddress || pair.url;
    const routeUrl = `/chart/${base.symbol}/${quote.symbol}`;
    const isSaved = getWatchlist().includes(address);

    return `
      <div onclick="window.location='${routeUrl}'">
        <div class="token-info">
          <img src="${base.icon || '/static/img/default.png'}">
          <div>
            <div class="fw-bold">${base.symbol}/${quote.symbol} <span class='badge-chain'>${chain}</span></div>
            <div class="token-meta">${shorten(address)}</div>
          </div>
        </div>
        <div class="token-stats">
          <div>$${price}</div>
          <div class="text-muted">Vol 24h: $${vol}</div>
        </div>
        <div>
          <button class="btn-watchlist ${isSaved ? 'saved' : ''}" onclick="event.stopPropagation(); toggleWatchlist('${address}')">⭐</button>
        </div>
      </div>
    `;
  }).join('');
}

// ✅ Rút gọn địa chỉ
function shorten(addr) {
  return addr?.length > 10 ? addr.slice(0, 6) + "..." + addr.slice(-4) : addr;
}

// ✅ Lấy danh sách Watchlist từ localStorage
function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist") || "[]");
}

// ✅ Thêm hoặc xóa địa chỉ khỏi Watchlist
function toggleWatchlist(address) {
  let list = getWatchlist();
  if (list.includes(address)) {
    list = list.filter(x => x !== address);
  } else {
    list.push(address);
  }
  localStorage.setItem("watchlist", JSON.stringify(list));
  input.dispatchEvent(new Event("input"));
}

// ✅ Đóng modal khi nhấn phím Escape hoặc click ra ngoài
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.remove("show");
    modal.classList.add("hidden");
  }
});

modal.addEventListener("click", (e) => {
  if (e.target.id === "search-modal") {
    modal.classList.remove("show");
    modal.classList.add("hidden");
  }
});

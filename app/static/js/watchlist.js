document.addEventListener('DOMContentLoaded', () => {
    const watchlistContainer = document.getElementById('watchlist-container');

    const getWatchlist = () => {
        return JSON.parse(localStorage.getItem('watchlist') || "[]");
    };

    const saveWatchlist = (watchlist) => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    };

    const renderWatchlist = () => {
        const watchlist = getWatchlist();
        watchlistContainer.innerHTML = '';

        if (watchlist.length === 0) {
            watchlistContainer.innerHTML = '<div class="empty-watchlist-text">Danh sách theo dõi của bạn đang trống.</div>';
            return;
        }

        watchlist.forEach(pairSymbol => {
            const item = document.createElement('div');
            item.className = 'watchlist-item clickable';
            item.style.cursor = 'pointer';

            const [tokenA, tokenB] = pairSymbol.split('/');

            // Chuyển đến /chart/tokenA/tokenB khi click
            item.onclick = () => {
                window.location.href = `/chart/${tokenA}/${tokenB}`;
            };

            const pairName = document.createElement('h5');
            pairName.textContent = pairSymbol;

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.className = 'btn-delete';

            // Hiển thị xác nhận trước khi xóa
            deleteBtn.onclick = (e) => {
                e.stopPropagation();

                Swal.fire({
                    title: `Xóa cặp ${pairSymbol}?`,
                    text: "Bạn có chắc chắn muốn xóa cặp token này khỏi danh sách theo dõi?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Xóa",
                    cancelButtonText: "Hủy"
                }).then((result) => {
                    if (result.isConfirmed) {
                        removePair(pairSymbol);
                        Swal.fire({
                            title: "Đã xóa!",
                            text: `Cặp ${pairSymbol} đã được xóa khỏi danh sách.`,
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                });
            };

            item.appendChild(pairName);
            item.appendChild(deleteBtn);
            watchlistContainer.appendChild(item);
        });
    };

    const removePair = (pairSymbol) => {
        let watchlist = getWatchlist();
        watchlist = watchlist.filter(symbol => symbol !== pairSymbol);
        saveWatchlist(watchlist);
        renderWatchlist();
    };

    renderWatchlist();
});

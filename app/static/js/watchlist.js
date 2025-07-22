document.addEventListener('DOMContentLoaded', () => {
    const watchlistBody = document.getElementById('watchlist-body');

    // Lấy watchlist từ localStorage hoặc tạo mảng rỗng nếu chưa có
    const getWatchlist = () => {
        const watchlist = localStorage.getItem('watchlist');
        // Trả về một vài cặp token mẫu nếu watchlist rỗng để demo
        return watchlist ? JSON.parse(watchlist) : ['BTC/USDT', 'ETH/USDT', 'SOL/BNB'];
    };

    // Lưu watchlist vào localStorage
    const saveWatchlist = (watchlist) => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    };

    // Hàm render lại danh sách trên giao diện
    const renderWatchlist = () => {
        const watchlist = getWatchlist();
        watchlistBody.innerHTML = ''; // Xóa danh sách cũ

        if (watchlist.length === 0) {
            watchlistBody.innerHTML = '<tr><td colspan="4" class="text-center empty-watchlist-text">Your watchlist is empty. Use the search bar to add new pairs.</td></tr>';
            return;
        }

        watchlist.forEach((pair, index) => {
            const [tokenA, tokenB] = pair.split('/');
            const row = document.createElement('tr');

            // Cột tên cặp token (là một link)
            const pairCell = document.createElement('td');
            const link = document.createElement('a');
            link.textContent = pair;
            link.href = `/chart/${tokenA}/${tokenB}`; // Điều hướng đến trang chart
            pairCell.appendChild(link);

            // Cột giá và thay đổi (dữ liệu giả lập để minh họa)
            const priceCell = document.createElement('td');
            priceCell.textContent = `$${(Math.random() * 70000).toFixed(2)}`;

            const changeCell = document.createElement('td');
            const changeValue = (Math.random() - 0.5) * 10;
            changeCell.textContent = `${changeValue.toFixed(2)}%`;
            changeCell.className = changeValue >= 0 ? 'positive' : 'negative';
            
            // Cột nút xóa
            const actionCell = document.createElement('td');
            actionCell.className = 'text-end';
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.className = 'btn btn-sm btn-danger-custom';
            deleteBtn.onclick = () => {
                removePair(index);
            };
            actionCell.appendChild(deleteBtn);

            row.appendChild(pairCell);
            row.appendChild(priceCell);
            row.appendChild(changeCell);
            row.appendChild(actionCell);
            watchlistBody.appendChild(row);
        });
    };
    
    // Hàm xóa một cặp khỏi danh sách
    const removePair = (index) => {
        if (confirm('Are you sure you want to remove this pair?')) {
            const watchlist = getWatchlist();
            watchlist.splice(index, 1); // Xóa phần tử tại vị trí index
            saveWatchlist(watchlist);
            renderWatchlist(); // Cập nhật lại giao diện
        }
    };
    
    // Render watchlist lần đầu khi trang được tải
    renderWatchlist();
});
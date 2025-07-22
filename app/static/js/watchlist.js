document.addEventListener('DOMContentLoaded', () => {
    const pairInput = document.getElementById('pairInput');
    const addPairBtn = document.getElementById('addPairBtn');
    const watchlistBody = document.getElementById('watchlist-body');

    // Lấy watchlist từ localStorage hoặc tạo mảng rỗng nếu chưa có
    const getWatchlist = () => {
        const watchlist = localStorage.getItem('watchlist');
        return watchlist ? JSON.parse(watchlist) : [];
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
            watchlistBody.innerHTML = '<tr><td colspan="2">Your watchlist is empty.</td></tr>';
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
            link.style.textDecoration = 'none';
            link.style.fontWeight = 'bold';
            pairCell.appendChild(link);
            
            // Cột nút xóa
            const actionCell = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '❌';
            deleteBtn.className = 'btn btn-sm btn-danger';
            deleteBtn.onclick = () => {
                removePair(index);
            };
            actionCell.appendChild(deleteBtn);

            row.appendChild(pairCell);
            row.appendChild(actionCell);
            watchlistBody.appendChild(row);
        });
    };

    // Hàm thêm một cặp mới
    const addPair = () => {
        const pair = pairInput.value.trim().toUpperCase();
        if (!pair.includes('/')) {
            alert('Định dạng không hợp lệ. Vui lòng nhập theo dạng: TOKENA/TOKENB (ví dụ: BTC/USDT)');
            return;
        }

        const watchlist = getWatchlist();
        if (watchlist.includes(pair)) {
            alert('Cặp token này đã có trong watchlist.');
            return;
        }

        watchlist.push(pair);
        saveWatchlist(watchlist);
        renderWatchlist(); // Cập nhật lại giao diện
        pairInput.value = ''; // Xóa ô input
    };
    
    // Hàm xóa một cặp khỏi danh sách
    const removePair = (index) => {
        const watchlist = getWatchlist();
        watchlist.splice(index, 1); // Xóa phần tử tại vị trí index
        saveWatchlist(watchlist);
        renderWatchlist(); // Cập nhật lại giao diện
    };
    
    // Gán sự kiện cho nút "Add Pair" và phím Enter
    addPairBtn.addEventListener('click', addPair);
    pairInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addPair();
        }
    });

    // Render watchlist lần đầu khi trang được tải
    renderWatchlist();
});
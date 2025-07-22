document.addEventListener('DOMContentLoaded', () => {
    const watchlistContainer = document.getElementById('watchlist-container');
    const addPairBtn = document.getElementById('add-pair-btn');

    // Cấu hình toast thông báo
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
        customClass: {
            popup: 'colored-toast'
        }
    });

    // Lấy watchlist từ localStorage hoặc tạo mảng rỗng
    const getWatchlist = () => {
        const watchlist = localStorage.getItem('watchlist');
        // Mặc định là mảng rỗng cho người dùng mới
        return watchlist ? JSON.parse(watchlist) : [];
    };

    // Lưu watchlist vào localStorage
    const saveWatchlist = (watchlist) => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    };

    // Hàm render lại danh sách trên giao diện
    const renderWatchlist = () => {
        const watchlist = getWatchlist();
        watchlistContainer.innerHTML = ''; 

        if (watchlist.length === 0) {
            watchlistContainer.innerHTML = '<div class="empty-watchlist-text">Danh sách theo dõi của bạn đang trống. Hãy thêm một cặp token mới!</div>';
            return;
        }

        watchlist.forEach((pair, index) => {
            const [tokenA, tokenB] = pair.split('/');
            const item = document.createElement('div');
            item.className = 'watchlist-item';
            const pairLink = document.createElement('a');
            pairLink.className = 'pair-details';
            pairLink.href = `/chart/${tokenA}/${tokenB}`;
            const pairName = document.createElement('h5');
            pairName.textContent = pair;
            const pairInfo = document.createElement('p');
            pairInfo.textContent = 'Xem biểu đồ và phân tích thời gian thực.';
            pairLink.appendChild(pairName);
            pairLink.appendChild(pairInfo);
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.className = 'btn-delete';
            deleteBtn.onclick = (e) => {
                e.preventDefault();
                removePair(index, pair); // Truyền thêm `pair` để hiển thị trong popup
            };
            item.appendChild(pairLink);
            item.appendChild(deleteBtn);
            watchlistContainer.appendChild(item);
        });
    };
    
    // Hàm xóa một cặp khỏi danh sách với popup xác nhận
    const removePair = (index, pair) => {
        Swal.fire({
            title: `Xóa cặp ${pair}?`,
            text: "Bạn sẽ không thể hoàn tác hành động này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#357ce1',
            cancelButtonColor: '#f6465d',
            confirmButtonText: 'Đồng ý, xóa nó!',
            cancelButtonText: 'Hủy bỏ',
            background: 'var(--dex-panel-bg)',
            color: 'var(--dex-text-primary)'
        }).then((result) => {
            if (result.isConfirmed) {
                const watchlist = getWatchlist();
                watchlist.splice(index, 1);
                saveWatchlist(watchlist);
                renderWatchlist();
                Toast.fire({
                    icon: 'success',
                    title: `Đã xóa ${pair} khỏi danh sách!`
                });
            }
        });
    };

    // Hàm hiển thị popup để thêm cặp token mới
    const showAddPairPopup = () => {
        Swal.fire({
            title: 'Thêm cặp token mới',
            html: `
                <input id="swal-input1" class="swal2-input" placeholder="Token A (e.g. BTC)">
                <input id="swal-input2" class="swal2-input" placeholder="Token B (e.g. USDT)">
            `,
            confirmButtonText: 'Thêm vào danh sách',
            confirmButtonColor: '#357ce1',
            background: 'var(--dex-panel-bg)',
            color: 'var(--dex-text-primary)',
            focusConfirm: false,
            preConfirm: () => {
                const tokenA = document.getElementById('swal-input1').value.toUpperCase();
                const tokenB = document.getElementById('swal-input2').value.toUpperCase();
                if (!tokenA || !tokenB) {
                    Swal.showValidationMessage(`Vui lòng nhập đầy đủ cả hai token`);
                }
                if (tokenA === tokenB) {
                    Swal.showValidationMessage(`Vui lòng nhập 2 token khác nhau`);
                }
                return { tokenA: tokenA, tokenB: tokenB };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { tokenA, tokenB } = result.value;
                const newPair = `${tokenA}/${tokenB}`;
                const watchlist = getWatchlist();
                
                if (watchlist.includes(newPair)) {
                     Toast.fire({
                        icon: 'error',
                        title: `${newPair} đã có trong danh sách!`
                    });
                    return;
                }

                watchlist.push(newPair);
                saveWatchlist(watchlist);
                renderWatchlist();
                Toast.fire({
                    icon: 'success',
                    title: `Đã thêm ${newPair} vào danh sách!`
                });
            }
        });
    };

    // Gán sự kiện click cho nút "Add New Pair"
    addPairBtn.addEventListener('click', showAddPairPopup);
    
    // Render watchlist lần đầu khi trang được tải
    renderWatchlist();
});
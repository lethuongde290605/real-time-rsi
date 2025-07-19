function addToWatchlist(pair) {
    fetch("/watchlist/add", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pair })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Added to watchlist", data);
    });
} 
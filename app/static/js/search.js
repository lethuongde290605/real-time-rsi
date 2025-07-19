function searchToken() {
    const query = document.getElementById("searchInput").value;
    fetch(`/search?q=${query}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
        });
} 
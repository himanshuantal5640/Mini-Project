const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  console.log(query);

  // Save to local storage only when there is a search term
  if (query) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const alreadyExists = history.some((item) => item.query === query);
    if (!alreadyExists) {
      history.push({
        query: query,
        time: Date.now()
      });
      localStorage.setItem("searchHistory", JSON.stringify(history));
    }
  }

  window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  searchInput.value = "";
});

// Suggestions feature
const suggestionBox = document.getElementById("suggestions");
searchInput.addEventListener("input", () => {
  const text = searchInput.value.toLowerCase();
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Filter based on query field
  const matches = history.filter(item => item.query.toLowerCase().includes(text));
  
  // Clear previous suggestions
  suggestionBox.innerHTML = "";

  // Show suggestions
  matches.forEach(item => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.textContent = item.query;

    div.addEventListener("click", () => {
      searchInput.value = item.query;
      suggestionBox.innerHTML = "";
    });

    suggestionBox.appendChild(div);
  });
});

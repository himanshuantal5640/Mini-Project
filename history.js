const historyContainer = document.getElementById("historyContainer");
let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Only keep items that have a non-empty search term (and clean stored history)
const validHistory = history.filter((item) => item.query && String(item.query).trim() !== "");
if (validHistory.length !== history.length) {
  localStorage.setItem("searchHistory", JSON.stringify(validHistory));
}
history.sort((a,b)=>b.time - a.time);
function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function renderHistory() {
  historyContainer.innerHTML = "";
  historyContainer.style.display = validHistory.length === 0 ? "none" : "flex";
  clearHistoryBtn.style.display = validHistory.length === 0 ? "none" : "inline-block";

  if (validHistory.length === 0) {
    return;
  }

  // Show newest first
  const sorted = [...validHistory].sort((a, b) => b.time - a.time);

  sorted.forEach((item) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
      <a href="search.html?q=${encodeURIComponent(item.query)}" class="history-query">${item.query}</a>
      <span class="history-time">${formatDateTime(item.time)}</span>
    `;
    historyContainer.appendChild(div);
  });
}

const clearHistoryBtn = document.getElementById("clearHistoryBtn");

renderHistory();
clearHistoryBtn.addEventListener("click", () => {
  if (validHistory.length === 0) return;
  if (confirm("Clear all search history?")) {
    localStorage.removeItem("searchHistory");
    history.length = 0;
    validHistory.length = 0;
    renderHistory();
  }
});



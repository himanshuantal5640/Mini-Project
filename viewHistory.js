const viewHistoryContainer = document.getElementById("viewHistoryContainer");
const clearViewHistoryBtn = document.getElementById("clearViewHistoryBtn");

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function loadViewHistory() {
  let viewHistory = JSON.parse(localStorage.getItem("viewHistory")) || [];
  const validViewHistory = viewHistory.filter(
    (item) => item.productId && item.title
  );

  if (validViewHistory.length !== viewHistory.length) {
    localStorage.setItem("viewHistory", JSON.stringify(validViewHistory));
  }

  viewHistoryContainer.innerHTML = "";

  if (validViewHistory.length === 0) {
    viewHistoryContainer.innerHTML = '<p class="empty-history">No viewed products yet.</p>';
    clearViewHistoryBtn.style.display = "none";
    return;
  }

  clearViewHistoryBtn.style.display = "inline-block";

  // newest first
  const sorted = [...validViewHistory].sort((a, b) => b.time - a.time);

  sorted.forEach((item) => {
    const div = document.createElement("div");
    div.className = "view-history-item";
    div.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}" class="view-history-thumbnail">
      <div class="view-history-info">
        <a href="product.html?id=${item.productId}" class="view-history-title">${item.title}</a>
        <p class="view-history-price">$${item.price}</p>
        <span class="view-history-time">${formatDateTime(item.time)}</span>
      </div>
    `;
    viewHistoryContainer.appendChild(div);
  });
}

clearViewHistoryBtn.addEventListener("click", () => {
  let viewHistory = JSON.parse(localStorage.getItem("viewHistory")) || [];
  if (!viewHistory.length) return;

  if (confirm("Clear all view history?")) {
    localStorage.removeItem("viewHistory");
    loadViewHistory();
  }
});

loadViewHistory();


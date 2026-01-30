const viewHistoryContainer = document.getElementById("viewHistoryContainer");
      let viewHistory = JSON.parse(localStorage.getItem("viewHistory")) || [];

      const validViewHistory = viewHistory.filter((item) => item.productId && item.title);
      if (validViewHistory.length !== viewHistory.length) {
        localStorage.setItem("viewHistory", JSON.stringify(validViewHistory));
      }
      viewHistory.sort((a, b) => b.time - a.time);

      function formatDateTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short"
        });
      }

      function renderViewHistory() {
        viewHistoryContainer.innerHTML = "";
        viewHistoryContainer.style.display = validViewHistory.length === 0 ? "none" : "flex";
        clearViewHistoryBtn.style.display = validViewHistory.length === 0 ? "none" : "inline-block";

        if (validViewHistory.length === 0) {
          return;
        }

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

      const clearViewHistoryBtn = document.getElementById("clearViewHistoryBtn");

      renderViewHistory();
      clearViewHistoryBtn.addEventListener("click", () => {
        if (validViewHistory.length === 0) return;
        if (confirm("Clear all view history?")) {
          localStorage.removeItem("viewHistory");
          viewHistory.length = 0;
          validViewHistory.length = 0;
          renderViewHistory();
        }
      });
// Reusable pagination helper (global)
// Usage:
// const pager = createPaginator({ pageSize, onPageChange });
// pager.attachControls({ prevBtn, nextBtn, infoEl });
// pager.setItems(items);
// pager.goToPage(1);

(function () {
  function createPaginator({ pageSize = 8, onPageChange }) {
    let items = [];
    let currentPage = 1;
    let totalPages = 1;

    let controls = null;

    function recalc() {
      totalPages = Math.max(1, Math.ceil(items.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;
    }

    function getSlice() {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return items.slice(start, end);
    }

    function updateControls() {
      if (!controls) return;
      const { prevBtn, nextBtn, infoEl } = controls;
      if (infoEl) infoEl.textContent = `Page ${currentPage} of ${totalPages}`;
      if (prevBtn) prevBtn.disabled = currentPage === 1;
      if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    }

    function render() {
      recalc();
      const slice = getSlice();
      if (typeof onPageChange === "function") onPageChange(slice, currentPage, totalPages);
      updateControls();
    }

    function setItems(nextItems) {
      items = Array.isArray(nextItems) ? nextItems : [];
      currentPage = 1;
      render();
    }

    function goToPage(page) {
      currentPage = Number(page) || 1;
      render();
    }

    function next() {
      if (currentPage < totalPages) {
        currentPage++;
        render();
      }
    }

    function prev() {
      if (currentPage > 1) {
        currentPage--;
        render();
      }
    }

    function attachControls({ prevBtn, nextBtn, infoEl }) {
      controls = { prevBtn, nextBtn, infoEl };
      if (prevBtn) prevBtn.addEventListener("click", prev);
      if (nextBtn) nextBtn.addEventListener("click", next);
      updateControls();
    }

    return { setItems, goToPage, next, prev, attachControls };
  }

  window.createPaginator = createPaginator;

  // ----- Page-specific wiring -----
  document.addEventListener("DOMContentLoaded", () => {
    function saveToViewHistory(product) {
      let viewHistory = JSON.parse(localStorage.getItem("viewHistory")) || [];
      const alreadyExists = viewHistory.some((item) => item.productId === product.id);
      if (!alreadyExists) {
        viewHistory.push({
          productId: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          price: product.price,
          time: Date.now()
        });
        localStorage.setItem("viewHistory", JSON.stringify(viewHistory));
      }
    }

    // Home page pagination (index.html)
    const box = document.querySelector(".box");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");

    if (box && prevBtn && nextBtn && pageInfo) {
      const homePager = createPaginator({
        pageSize: 8,
        onPageChange: (slice) => {
          box.innerHTML = "";
          slice.forEach((product) => {
            let card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                `;
            box.appendChild(card);
            card.addEventListener("click", () => {
              saveToViewHistory(product);
              window.location.href = `product.html?id=${product.id}`;
            });
          });
        }
      });

      homePager.attachControls({ prevBtn, nextBtn, infoEl: pageInfo });

      fetch("https://dummyjson.com/products")
        .then((res) => res.json())
        .then((data) => {
          homePager.setItems(data.products || []);
        })
        .catch((err) => console.log(err));
    }

    // Search page pagination (search.html)
    const resultsContainer = document.getElementById("results");
    const prevSearchBtn = document.getElementById("prevSearchBtn");
    const nextSearchBtn = document.getElementById("nextSearchBtn");
    const pageInfoSearch = document.getElementById("pageInfoSearch");

    if (resultsContainer && prevSearchBtn && nextSearchBtn && pageInfoSearch) {
      const params = new URLSearchParams(window.location.search);
      const query = (params.get("q") || "").toLowerCase();

      const searchPager = createPaginator({
        pageSize: 8,
        onPageChange: (slice) => {
          resultsContainer.innerHTML = "";
          slice.forEach((product) => {
            let card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
              <img src="${product.thumbnail}" alt="${product.title}">
              <h3>${product.title}</h3>
              <p>$${product.price}</p>
            `;
            card.addEventListener("click", () => {
              saveToViewHistory(product);
              window.location.href = `product.html?id=${product.id}`;
            });
            resultsContainer.appendChild(card);
          });
        }
      });

      searchPager.attachControls({
        prevBtn: prevSearchBtn,
        nextBtn: nextSearchBtn,
        infoEl: pageInfoSearch
      });

      fetch("https://dummyjson.com/products")
        .then((res) => res.json())
        .then((data) => {
          const products = data.products || [];
          const filtered = products.filter((p) =>
            p.title.toLowerCase().includes(query)
          );
          searchPager.setItems(filtered);
        })
        .catch((err) => console.log(err));
    }
  });
})();


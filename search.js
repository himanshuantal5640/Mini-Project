let param = new URLSearchParams(window.location.search);
let query = param.get("q");

fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    let products = data.products;
    let filtered = products.filter((p) => {
      return p.title.toLowerCase().includes(query.toLowerCase());
    });
    let container = document.getElementById("results");
    filtered.forEach((product) => {
      let card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
      `;
      card.addEventListener("click", () => {
        // Save to view history
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
        
        window.location.href = `product.html?id=${product.id}`;
      });
      container.appendChild(card);
    });
  })
  .catch((err) => console.log(err));

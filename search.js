let param = new URLSearchParams(window.location.search);
let query = param.get("q");

// let box = document.querySelector(".box");
fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    let products = data.products;
    let filtered = products.filter((p) =>{
      return p.title.toLowerCase().includes(query.toLowerCase());
    })
   let container = document.getElementById("results");
   filtered.forEach((product) => {
      let card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
      `;
      container.appendChild(card);
    });
    })
  
  .catch((err) => console.log(err));
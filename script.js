let box = document.querySelector(".box");
fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    data.products.forEach((product) => {
      let card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                `;
      box.appendChild(card);
    });
  })
  .catch((err) => console.log(err));

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  const query = searchInput.value;
  console.log(query);
  
  //save to local storage
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!history.includes(query)) {
    history.push({
      query: query,
      time: Date.now()
    });
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }

  window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  searchInput.value = "";

});

//suggestions feature
const suggestionBox = document.getElementById("suggestions");
searchInput.addEventListener("input", () => {
  // console.log("Input event triggered");

  const text = searchInput.value.toLowerCase();
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  // console.log("Search history:", history);

  //Filter based on query field
  const matches = history.filter(item => item.query.toLowerCase().includes(text));
  // console.log("Matching suggestions:", matches);
  //clear previous suggestions
  suggestionBox.innerHTML = "";

  //show suggestions
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


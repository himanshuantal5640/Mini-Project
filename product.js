const detailsContainer = document.getElementById("productDetails");

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
  detailsContainer.innerHTML = "<p>Product not found.</p>";
} else {
  fetch(`https://dummyjson.com/products/${productId}`)
    .then((res) => res.json())
    .then((product) => {
      if (!product || !product.id) {
        detailsContainer.innerHTML = "<p>Product not found.</p>";
        return;
      }

      const imagesHtml = (product.images || [])
        .map(
          (img) => `<img src="${img}" alt="${product.title}" class="product-image">`
        )
        .join("");

      detailsContainer.innerHTML = `
        <div class="product-details-card">
          <div class="product-images">
            ${imagesHtml || `<img src="${product.thumbnail}" alt="${product.title}" class="product-image">`}
          </div>
          <div class="product-info">
            <h2>${product.title}</h2>
            <p class="product-price">$${product.price}</p>
            <p class="product-description">${product.description || ""}</p>
            <p><strong>Brand:</strong> ${product.brand || "N/A"}</p>
            <p><strong>Category:</strong> ${product.category || "N/A"}</p>
            <p><strong>Rating:</strong> ${product.rating || "N/A"}</p>
            <p><strong>Stock:</strong> ${product.stock || "N/A"}</p>
          </div>
        </div>
      `;
    })
    .catch((err) => {
      console.error(err);
      detailsContainer.innerHTML = "<p>Failed to load product details.</p>";
    });
}

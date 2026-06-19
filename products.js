async function loadProducts() {

  try {

    console.log("Loading products...");

    const response =
      await getData('/products');

    console.log(
      "API Response:",
      response
    );

    const products =
      response.products || [];

    const container =
      document.getElementById(
        'products-grid'
      );

    if (!container) {

      console.error(
        'products-grid not found'
      );

      return;
    }

    container.innerHTML = '';

    products.forEach(product => {

      container.innerHTML += `
        <div
          class="product-card"
          onclick="openProduct('${product._id}')"
        >

          <div class="product-card-img">

            <img
              src="${product.images?.[0] || ''}"
              alt="${product.name}"
              style="
                width:100%;
                height:100%;
                object-fit:cover;
              "
            />

          </div>

          <div class="product-card-info">

            <h4>
              ${product.name}
            </h4>

            <div class="price">
              ₹${product.price}
            </div>

          </div>

        </div>
      `;
    });

    console.log(
      `${products.length} products loaded`
    );

  } catch (error) {

    console.error(
      'Error loading products:',
      error
    );
  }
}
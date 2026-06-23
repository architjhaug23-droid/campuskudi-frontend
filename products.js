// product.js

const API_URL = "http://api.campuskudi.com/api";

// Load all products
async function loadProducts() {
    try {

        console.log("Loading products...");

        const response = await fetch(
            `${API_URL}/products`
        );

        const data = await response.json();

        console.log(data);

        const products =
            data.products || [];

        const container =
            document.getElementById(
                "products-grid"
            );

        if (!container) {
            console.error(
                "products-grid not found"
            );
            return;
        }

        container.innerHTML = "";

        if (products.length === 0) {

            container.innerHTML = `
                <div style="
                    text-align:center;
                    padding:40px;
                    width:100%;
                ">
                    No products available
                </div>
            `;

            return;
        }

        products.forEach(product => {

            const image =
                product.images &&
                product.images.length
                    ? product.images[0]
                    : "https://via.placeholder.com/400x500";

            const price =
                product.finalPrice ||
                product.price ||
                0;

            container.innerHTML += `
                <div
                    class="product-card"
                    onclick="openProduct('${product._id}')"
                >

                    <div class="product-card-img">

                        <img
                            src="${image}"
                            alt="${product.name}"
                            style="
                                width:100%;
                                height:100%;
                                object-fit:cover;
                            "
                        >

                    </div>

                    <div class="product-card-info">

                        <h4>
                            ${product.name}
                        </h4>

                        <div class="price">
                            ₹${price}
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
            "Error loading products:",
            error
        );

        const container =
            document.getElementById(
                "products-grid"
            );

        if (container) {

            container.innerHTML = `
                <div style="
                    text-align:center;
                    color:red;
                    padding:40px;
                ">
                    Unable to load products
                </div>
            `;
        }
    }
}

// Open product details page
function openProduct(productId) {

    window.location.href =
        `product.html?id=${productId}`;
}

// Load single product
async function loadProductDetails() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const productId =
        params.get("id");

    if (!productId) return;

    try {

        const response =
            await fetch(
                `${API_URL}/products/${productId}`
            );

        const data =
            await response.json();

        const product =
            data.product;

        if (!product) return;

        const title =
            document.getElementById(
                "product-name"
            );

        const price =
            document.getElementById(
                "product-price"
            );

        const image =
            document.getElementById(
                "product-image"
            );

        const description =
            document.getElementById(
                "product-description"
            );

        if (title)
            title.textContent =
                product.name;

        if (price)
            price.textContent =
                `₹${product.finalPrice || product.price}`;

        if (image)
            image.src =
                product.images?.[0] || "";

        if (description)
            description.textContent =
                product.description || "";

    } catch (error) {

        console.error(
            "Error loading product:",
            error
        );
    }
}

// Add to cart
async function addToCart(productId) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        alert(
            "Please login first"
        );

        window.location.href =
            "login.html";

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/cart/add`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        productId,
                        quantity: 1
                    })
                }
            );

        const data =
            await response.json();

        alert(
            data.message ||
            "Added to cart"
        );

    } catch (error) {

        console.error(error);

        alert(
            "Unable to add product"
        );
    }
}

// Auto-run
document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.getElementById(
                "products-grid"
            )
        ) {
            loadProducts();
        }

        if (
            document.getElementById(
                "product-name"
            )
        ) {
            loadProductDetails();
        }
    }
);

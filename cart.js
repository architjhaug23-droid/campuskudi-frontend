// cart.js

async function addToCart(productId = null) {

  try {

    const token = localStorage.getItem('token');

    if (!token) {

      alert('Please login first');

      if (typeof showPage === 'function') {
        showPage('login');
      } else {
        window.location.href = 'login.html';
      }

      return;
    }

    if (!productId) {
      productId =
        localStorage.getItem('selectedProduct');
    }

    if (!productId) {
      alert('No product selected');
      return;
    }

    const response = await fetch(
      `${API_URL}/cart/add`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          selectedSize: 'M',
          selectedColor: 'Default'
        })
      }
    );

    const result = await response.json();

    if (result.success) {

      alert('Product Added To Cart');

      if (
        document.getElementById('cart-items')
      ) {
        loadCart();
      }

    } else {

      alert(
        result.message ||
        'Unable to add product'
      );
    }

  } catch (error) {

    console.error(
      'Add To Cart Error:',
      error
    );

    alert('Unable To Add Product');
  }
}


async function loadCart() {

  try {

    const token =
      localStorage.getItem('token');

    if (!token) return;

    const response = await fetch(
      `${API_URL}/cart`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    const result =
      await response.json();

    console.log(
      'Cart Response:',
      result
    );

    const cart =
      result.cart || {};

    const container =
      document.getElementById(
        'cart-items'
      );

    if (!container) return;

    container.innerHTML = '';

    if (
      !cart.items ||
      cart.items.length === 0
    ) {

      container.innerHTML = `
        <div class="empty-cart">
          Your cart is empty
        </div>
      `;

      return;
    }

    cart.items.forEach(item => {

      const image =
        item.product?.images?.[0] ||
        'https://via.placeholder.com/100';

      const name =
        item.product?.name ||
        'Product';

      const price =
        item.selectedPrice ||
        item.product?.finalPrice ||
        item.product?.price ||
        0;

      container.innerHTML += `
        <div class="cart-item">

          <img
            src="${image}"
            width="80"
          >

          <div>

            <h4>${name}</h4>

            <p>₹${price}</p>

            <div>

              <button
                onclick="decreaseQuantity('${item._id}', ${item.quantity})"
              >
                -
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                onclick="increaseQuantity('${item._id}', ${item.quantity})"
              >
                +
              </button>

            </div>

            <button
              onclick="removeFromCart('${item._id}')"
            >
              Remove
            </button>

          </div>

        </div>
      `;
    });

    const summary =
      document.getElementById(
        'cart-summary'
      );

    if (summary) {

      summary.innerHTML = `
        <h3>
          Total: ₹${cart.totalAmount || 0}
        </h3>
      `;
    }

  } catch (error) {

    console.error(
      'Cart Error:',
      error
    );
  }
}


async function increaseQuantity(
  itemId,
  currentQty
) {

  try {

    const token =
      localStorage.getItem('token');

    await fetch(
      `${API_URL}/cart/update/${itemId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`
        },
        body: JSON.stringify({
          quantity:
            currentQty + 1
        })
      }
    );

    loadCart();

  } catch (error) {

    console.error(error);
  }
}


async function decreaseQuantity(
  itemId,
  currentQty
) {

  if (currentQty <= 1) return;

  try {

    const token =
      localStorage.getItem('token');

    await fetch(
      `${API_URL}/cart/update/${itemId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`
        },
        body: JSON.stringify({
          quantity:
            currentQty - 1
        })
      }
    );

    loadCart();

  } catch (error) {

    console.error(error);
  }
}


async function removeFromCart(
  itemId
) {

  try {

    const token =
      localStorage.getItem('token');

    await fetch(
      `${API_URL}/cart/remove/${itemId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    loadCart();

  } catch (error) {

    console.error(error);
  }
}


function openCart() {

  if (
    typeof showPage === 'function'
  ) {
    showPage('cart');
  }

  loadCart();
}


document.addEventListener(
  'DOMContentLoaded',
  () => {

    if (
      document.getElementById(
        'cart-items'
      )
    ) {
      loadCart();
    }
  }
);

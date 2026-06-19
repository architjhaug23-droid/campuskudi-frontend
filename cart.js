async function addToCart() {

  try {

    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login first');
      showPage('login');
      return;
    }

    const productId =
      localStorage.getItem('selectedProduct');

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
    } else {
      alert(result.message);
    }

  } catch (error) {
    console.error(error);
    alert('Unable To Add Product');
  }
}


async function loadCart() {

  try {

    const token = localStorage.getItem('token');

    const response = await fetch(
      `${API_URL}/cart`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const result = await response.json();

    console.log('Cart Response:', result);

    const cart = result.cart;

    const container =
      document.getElementById('cart-items');

    if (!container) return;

    container.innerHTML = '';

    if (!cart || !cart.items) return;

    cart.items.forEach(item => {

      container.innerHTML += `
        <div class="cart-item">

          <img
            src="${item.product?.images?.[0] || ''}"
            width="80"
          >

          <div>

            <h4>${item.product?.name || 'Product'}</h4>

            <p>₹${item.selectedPrice || 0}</p>

            <div>

              <button onclick="decreaseQuantity('${item._id}', ${item.quantity})">
                -
              </button>

              <span>${item.quantity}</span>

              <button onclick="increaseQuantity('${item._id}', ${item.quantity})">
                +
              </button>

            </div>

            <button onclick="removeFromCart('${item._id}')">
              Remove
            </button>

          </div>

        </div>
      `;
    });

    const summary =
      document.getElementById('cart-summary');

    if (summary) {
      summary.innerHTML = `
        <h3>Total: ₹${cart.totalAmount || 0}</h3>
      `;
    }

  } catch (error) {
    console.error('Cart Error:', error);
  }
}


async function increaseQuantity(itemId, currentQty) {

  const token =
    localStorage.getItem('token');

  await fetch(
    `${API_URL}/cart/update/${itemId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        quantity: currentQty + 1
      })
    }
  );

  loadCart();
}


async function decreaseQuantity(itemId, currentQty) {

  if (currentQty <= 1) return;

  const token =
    localStorage.getItem('token');

  await fetch(
    `${API_URL}/cart/update/${itemId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        quantity: currentQty - 1
      })
    }
  );

  loadCart();
}


async function removeFromCart(itemId) {

  const token =
    localStorage.getItem('token');

  await fetch(
    `${API_URL}/cart/remove/${itemId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  loadCart();
}


function openCart() {

  showPage('cart');

  loadCart();
}
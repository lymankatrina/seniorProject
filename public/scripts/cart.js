async function isUserAuthenticated() {
  try {
    const response = await fetch('/profile');
    return response.ok;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

async function fetchShoppingCart() {
  const isAuthenticated = await isUserAuthenticated();
  if (!isAuthenticated) {
    window.location.href = '/login';
    return;
  }
  
  try {
    const response = await fetch('/carts/user');
    if (!response.ok) {
      throw new Error('Failed to fetch shopping cart');
    }
    const cart = await response.json();
    const prices = await fetchPrices();
    displayShoppingCart(cart, prices);
  } catch (error) {
    console.error('Error fetching shopping cart:', error);
    displayMessage('Error fetching shopping cart:', + error.message);
  }
}

async function fetchPrices() {
  try {
    const response = await fetch ('/prices');
    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }
    const prices = await response.json();
    console.log('Prices fetched:', prices);
    return prices;
  } catch (error) {
    console.error('Error fetching prices:', error);
    return [];
  }
}

function displayShoppingCart(cart, prices) {
  const shoppingCartDiv = document.getElementById('shoppingCart');
  if (!cart || cart.tickets.length === 0) {
    shoppingCartDiv.innerHTML = '<p>Your shopping cart is empty.</p>';
    return;
  }

  console.log('Cart:', cart);
  console.log('Prices:', prices);

  const ticketsHtml = cart.tickets.map(ticket => `
      <div class="cart-item">
      <input type="checkbox" class="ticket-checkbox" data-ticket-id="${ticket.ticketId}">
        <p>Ticket ID: ${ticket.ticketId}</p>
        <p>Movie: ${ticket.movieTitle}</p>
        <p>Date: ${ticket.showtimeDate} | Time: ${ticket.showtimeTime}</p>
        <p>Seat Number: ${ticket.ticketNumber}</p>
        <p>Added At: ${new Date(ticket.addedAt).toLocaleString()}</p>
        <select onchange="updatePriceType('${ticket.ticketId}', this.value)">
          ${prices.map(price => `<option value="${price.priceType}" ${ticket.priceType === price.priceType ? 'selected' : ''}>${price.priceType} - $${price.price}</option>`).join('')}
        </select>
      </div>
    `).join('');

    shoppingCartDiv.innerHTML = `
      <h2>Your Shopping Cart</h2>
      <div class="cart-items">
        ${ticketsHtml}
      </div>
      <div id="cartSubtotal">Subtotal: $ 0.00 </div>
      </br>
      <button onclick="removeSelectedItems()">Remove Selected Items</button>
    `;

    updateCartSubtotal(prices);
}

async function updateCartSubtotal(prices) {
  if (!prices) {
    prices = await fetchPrices();
  }

  const priceTypes = Array.from(document.querySelectorAll('.cart-item select')).map(select => select.value);
  const priceMap = prices.reduce((map, price) => {
    map[price.priceType] = parseFloat(price.price);
    return map;
  }, {});

  console.log('Price Types:', priceTypes);
  console.log('Price Map:', priceMap);

  const subtotal = priceTypes.reduce((total, type) => total + (priceMap[type] || 0), 0);
  const cartSubtotalDiv = document.getElementById('cartSubtotal');
  if (cartSubtotalDiv) {
    cartSubtotalDiv.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
  } else {
    console.error('cartSubtotal element not found');
  }
}

async function updatePriceType(ticketId, priceType) {
  try {
    const response = await fetch('/carts/updatePriceType', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ticketId, priceType })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update price type');
    }

    const updatedCart = await response.json();
    console.log('Price type updated:', updatedCart);
    fetchShoppingCart();
  } catch (error) {
    console.error('Error updating price type:', error);
    displayMessage('Error updating price type: ' + error.message);
  }
}

async function removeSelectedItems() {
  const selectedTicketIds = Array.from(document.querySelectorAll('.ticket-checkbox:checked')).map(checkbox => checkbox.dataset.ticketId);

  if (selectedTicketIds.length === 0) {
    alert('No items selected.');
    return;
  }

  try {
    const response = await fetch('/carts/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ticketIds: selectedTicketIds })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove items from cart');
    }

    const data = await response.json();
    console.log('Cart updated:', data);
    displayMessage('Items removed successfully.');
    fetchShoppingCart();
  } catch (error) {
    console.error('Error removing items from cart:', error);
    displayMessage('Error removing items form cart: ' + error.message);
  }
}

function displayMessage(message) {
  const cartMessageDiv = document.getElementById('cartMessage');
  cartMessageDiv.textContent = message;
}

document.addEventListener('DOMContentLoaded', fetchShoppingCart);

window.removeSelectedItems = removeSelectedItems;
window.updatePriceType = updatePriceType;
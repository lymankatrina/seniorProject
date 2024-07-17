function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    movieId: params.get('movieId'),
    title: params.get('title'),
    showtimeId: params.get('showtimeId'),
    startDate: params.get('startDate'),
    endDate: params.get('endDate'),
    time: params.get('time'),
    type: params.get('type')
  };
}

async function openTicketForm(showtimeId, startDate, endDate, title) {
  const dateOptions = getDateOptions(startDate, endDate);

  const ticketFormContainer = document.getElementById('getTicketFormContainer');
  ticketFormContainer.innerHTML = `
  <h2>${title}</h2>
    <form id="ticketForm" onsubmit="return fetchAvailableTickets(event, '${showtimeId}')">
    <h3>Select a Date</h3>
    <label for="date">Available Dates: </label>
    <select id="date" name="date" required>
      ${dateOptions.map((date) => `<option value="${date}">${date}</option>`).join('')}
      </select>
      <button type="submit">Fetch Available Tickets</button>
      </form>
      <div id="getAvailableTicketsContainer"></div>
  `;
  ticketFormContainer.style.display = 'block';
}

function getDateOptions(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];
  let currentDate = start;

  while (currentDate <= end) {
    dateArray.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

async function fetchAvailableTickets(event, showtimeId) {
  event.preventDefault();
  const date = document.getElementById('date').value;

  try {
    const response = await fetch(`/tickets/seating/${showtimeId}/${date}`);
    if (!response.ok) {
      throw new Error('Failed to fetch available tickets');
    }
    const tickets = await response.json();
    displayAvailableTickets(tickets, date, showtimeId);
  } catch (error) {
    console.error('Error fetching available tickets:', error);
  }
}

function displayAvailableTickets(tickets, date, showtimeId) {
  const availableTicketsContainer = document.getElementById('getAvailableTicketsContainer');
  availableTicketsContainer.innerHTML = `
    <h3>Available Seats for ${date}:</h3>
    <div id="seatsContainer" class="seatsContainer"></div>
    <button onclick="addToCart('${showtimeId}', '${date}')">Add To Cart</button>
        `;

  const seatsContainer = document.getElementById('seatsContainer');

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.innerHTML = `<p>SCREEN</p>`;

  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML = `
          <div id="seatsLegendContainer" class="seatsLegendContainer">
            <div class="legend-item">
              <div class="legend-color legend-available"></div>
              <p>Available (blue)</p>
            </div>
            <div class="legend-item">
              <div class="legend-color legend-sold"></div>
              <p>Sold (red)</p>
            </div>
            <div class="legend-item">
              <div class="legend-color legend-reserved"></div>
              <p>Reserved (yellow)</p>
            </div>
            <div class="legend-item">
              <div class="legend-color legend-wheelchair"></div>
              <p>Wheelchair space (bring your own wheelchair)</p>
            </div>
          `;

  const orderedTickets = tickets.sort((a, b) => a.ticketNumber - b.ticketNumber);

  const leftSection = document.createElement('div');
  leftSection.className = 'seat-section left-section';
  const centerSection = document.createElement('div');
  centerSection.className = 'seat-section center-section';
  const rightSection = document.createElement('div');
  rightSection.className = 'seat-section right-section';

  const selectedTickets = new Set();

  orderedTickets.forEach((ticket, index) => {
    const seatElement = document.createElement('div');
    seatElement.classList.add('seat');
    seatElement.textContent = ticket.ticketNumber;
    seatElement.dataset.ticketId = ticket._id;

    const totalLeftSeats = 19 * 3;
    const totalCenterSeats = 15 * 8;

    const leftRowIndex = Math.floor(index / 3);
    const leftColIndex = index % 3;
    const centerRowIndex = Math.floor((index - totalLeftSeats) / 8);
    const centerColIndex = (index - totalLeftSeats) % 8;
    const rightRowIndex = Math.floor((index - totalLeftSeats - totalCenterSeats) / 3);
    const rightColIndex = (index - totalLeftSeats - totalCenterSeats) % 3;

    if (leftRowIndex === 5 && leftColIndex === 2 && index < totalLeftSeats) {
      seatElement.classList.add('seat', 'wheelchair');
      seatElement.textContent = 'WC';
    } else if (centerRowIndex === 4 && centerColIndex === 7 && index >= totalLeftSeats && index < totalLeftSeats + totalCenterSeats) {
      seatElement.classList.add('seat', 'wheelchair');
      seatElement.textContent = 'WC';
    } else if (centerRowIndex === 9 && centerColIndex === 0 && index >= totalLeftSeats && index < totalLeftSeats + totalCenterSeats) {
      seatElement.classList.add('seat', 'wheelchair');
      seatElement.textContent = 'WC';
    } else if (
      rightRowIndex === 2 &&
      rightColIndex === 0 &&
      index >= totalLeftSeats + totalCenterSeats &&
      index < totalLeftSeats + totalCenterSeats + 16 * 3
    ) {
      seatElement.classList.add('seat', 'wheelchair');
      seatElement.textContent = 'WC';
    } else if (
      rightRowIndex === 8 &&
      rightColIndex === 0 &&
      index >= totalLeftSeats + totalCenterSeats &&
      index < totalLeftSeats + totalCenterSeats + 16 * 3
    ) {
      seatElement.classList.add('seat', 'wheelchair');
      seatElement.textContent = 'WC';
    } else {
      switch(ticket.status) {
        case 'available':
          seatElement.classList.add('available');
          break;
        case 'sold':
          seatElement.classList.add('sold');
          break;
        case 'reserved':
          seatElement.classList.add('reserved');
          break;
        default:
          seatElement.classList.add('unavailable');
      }
    }
    
async function isUserAuthenticated() {
  try {
    const response = await fetch('/profile');
    return response.ok;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

function displayAuthenticationMessage() {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('auth-message');
  messageContainer.innerHTML = `
    <p>You must be signed in to select seats or add items to your cart.</p>
    <button onclick="window.location.href='/login'">Sign In</button>
  `;
  const ticketFormContainer = document.getElementById('getTicketFormContainer');
  ticketFormContainer.innerHTML = '';
  ticketFormContainer.appendChild(messageContainer);
}

    seatElement.addEventListener('click', async () => {
      if (!await isUserAuthenticated()) {
        displayAuthenticationMessage();
        return;
      }

      if (selectedTickets.size < 10 || seatElement.classList.contains('selected')) {
        seatElement.classList.toggle('selected');
        if (seatElement.classList.contains('selected')) {
          selectedTickets.add(ticket._id);
        } else {
          selectedTickets.delete(ticket._id);
        }
      } else {
        alert('You can select up to 10 tickets only.');
      }
    });

    if (index < totalLeftSeats) {
      leftSection.appendChild(seatElement);
    } else if (index < totalLeftSeats + totalCenterSeats) {
      centerSection.appendChild(seatElement);
    } else {
      rightSection.appendChild(seatElement);
    }
  });

  seatsContainer.appendChild(screen);
  seatsContainer.appendChild(leftSection);
  seatsContainer.appendChild(centerSection);
  seatsContainer.appendChild(rightSection);
  seatsContainer.appendChild(legend);

  window.selectedTickets = selectedTickets;
}

async function addToCart(showtimeId, date) {
  const selectedTickets = Array.from(window.selectedTickets);
  
  // log the selected tickets
  console.log('Selected Tickets:', selectedTickets);

  try {
    const response = await fetch('/carts/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ticketIds: selectedTickets })
    });

    console.log('Response Status:', response.status);

    const addToCartMessage = document.getElementById('addToCartMessage');

    if (!response.ok) {
      const errorData = await response.json();
      addToCartMessage.textContent = errorData.message || 'Failed to add items to cart';
      console.error('Error adding items to cart:', errorData);
      return;
    }

    const data = await response.json();
    addToCartMessage.textContent = `Successfully added to shopping cart`;
    document.getElementById('getTicketFormContainer').style.display='none';

  } catch (error) {
    console.error('Error adding items to cart:', error);
    document.getElementById('addToCartMessage').textContent = (`Error: ${error.message}`);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const { showtimeId, startDate, endDate, title } = getQueryParams();
  openTicketForm(showtimeId, startDate, endDate, title);
});

window.openTicketForm = openTicketForm;
window.fetchAvailableTickets = fetchAvailableTickets;
window.addToCart = addToCart;

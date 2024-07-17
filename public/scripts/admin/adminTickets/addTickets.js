export function generateTickets() {
  document.getElementById('generateTicketsForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const showtimeId = document.getElementById('showtimeId').value;
    console.log(`Generating tickets for showtime ID: ${showtimeId}`);
    try {
      const response = await fetch(`http://localhost:8080/tickets/generate/${showtimeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      const ticketsMessageDiv = document.getElementById('ticketsMessage');
      const formattedMessage = `
      <p class="ticketMessage">Message: ${data.message}</p>
      <p class="ticketMessage">Inserted Count: ${data.insertedCount}</p>
    `;

      ticketsMessageDiv.innerHTML = formattedMessage;
      document.getElementById('generateTicketsForm').reset();
    } catch (error) {
      document.getElementById('ticketsMessage').textContent = 'Error generating Tickets';
      console.error('Error:', error);
    }
  });
}

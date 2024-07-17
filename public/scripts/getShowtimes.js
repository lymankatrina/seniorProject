function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    movieId: params.get('movieId'),
    title: params.get('title'),
    poster: params.get('poster')
  };
}

async function fetchShowtimes(movieId) {
  try {
    const response = await fetch(`http://localhost:8080/showtimes/search/${movieId}`);
    if (!response.ok) {
      alert('Failed to fetch showtimes');
      return;
    }
    let showtimes = await response.json();
    console.log('Fetched showtimes:', showtimes);

    if (!Array.isArray(showtimes)) {
      showtimes = [showtimes];
    }
    const today = new Date().toISOString().split('T')[0];
    showtimes = showtimes.filter((showtime) => showtime.endDate >= today);

    return showtimes;
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    return [];
  }
}

function displayShowtimes(showtimes, movieId, title, poster) {
  const showtimeInfoContainer = document.getElementById('showtimeInfoContainer');
  showtimeInfoContainer.innerHTML = `
    <h2>${title}</h2>
    <img src="${poster}" alt="${title} Poster">
    <h3>Showtimes:</h3>
    ${showtimes
      .map(
        (showtime) => `
        <div>
          <p>${showtime.startDate} - ${showtime.endDate} ${showtime.time} (${showtime.type})</p>
      
          <button onclick="openTicketForm('${movieId}', '${title}', '${showtime._id}', '${showtime.startDate}', '${showtime.endDate}', '${showtime.time}', '${showtime.type}')">Get Tickets</button>
        </div>
        `
      )
      .join('')}
  `;
  showtimeInfoContainer.style.display = 'block';
}

function openTicketForm(movieId, title, showtimeId, startDate, endDate, time, type) {
  const url = `getTickets.html?movieId=${encodeURIComponent(movieId)}&title=${encodeURIComponent(title)}&showtimeId=${encodeURIComponent(
    showtimeId
  )}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&time=${encodeURIComponent(time)}&type=${encodeURIComponent(
    type
  )}`;
  window.location.href = url;
}

document.addEventListener('DOMContentLoaded', async function () {
  const { movieId, title, poster } = getQueryParams();

  if (movieId) {
    const showtimes = await fetchShowtimes(movieId);
    displayShowtimes(showtimes, movieId, title, poster);
  } else {
    document.getElementById('showtimeInfoContainer').innerHTML = '<p>Invalid movie selection.</p>';
  }
});

window.openTicketForm = openTicketForm;

export { fetchShowtimes, displayShowtimes };

import { movieSchema } from './moviesSchema.js';

export async function getShowtimes(movieId) {
  try {
    const response = await fetch(`http://localhost:8080/showtimes/search/${movieId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch showtimes');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    return [];
  }
}

export function loadMovies() {
  console.log('loadMovies called');
  fetch('http://localhost:8080/movies/all')
    .then((response) => response.json())
    .then(async (movies) => {
      const movieCardsContainer = document.getElementById('movieCardsContainer');
      movieCardsContainer.innerHTML = '';

      for (const movie of movies) {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const idFieldElement = document.createElement('p');
        idFieldElement.classList.add('_id');
        idFieldElement.innerHTML = `<strong>ID:</strong> ${movie._id}`;
        movieCard.appendChild(idFieldElement);

        movieSchema.forEach((field) => {
          let fieldElement;

          if (field.type === 'url') {
            if (field.id === 'poster') {
              fieldElement = document.createElement('img');
              fieldElement.src = movie[field.id];
              fieldElement.alt = `${movie.title} Poster`;
              fieldElement.classList.add(field.id);
            } else if (field.id === 'trailer') {
              fieldElement = document.createElement('iframe');
              fieldElement.src = movie[field.id];
              fieldElement.alt = `${movie.title} Trailer`;
              fieldElement.classList.add(field.id);
            }
          } else {
            fieldElement = document.createElement('p');
            fieldElement.classList.add(field.id);

            let fieldValue = movie[field.id];
            if (fieldValue === false) {
              fieldValue = 'false';
            } else if (fieldValue === true) {
              fieldValue = 'true';
            }

            fieldElement.innerHTML = `<strong>${field.label}:</strong> ${fieldValue || ''}`;
          }

          movieCard.appendChild(fieldElement);
        });

        const showtimes = await getShowtimes(movie._id);
        const showtimesElement = document.createElement('div');
        showtimesElement.classList.add('showtimes');

        if (showtimes.length > 0) {
          showtimes.forEach((showtime) => {
            const showtimeElement = document.createElement('p');
            showtimeElement.innerHTML = `<strong>SCHEDULED SHOWTIMES</br></strong>
            Showtime ID: ${showtime._id}</br>
            <strong>
            Dates: ${showtime.startDate} to ${showtime.endDate}</br>Time: ${showtime.time}</strong></br>Type: ${showtime.type}</br>Tickets available per show: ${showtime.ticketsAvailable}`;
            showtimesElement.appendChild(showtimeElement);
          });
        } else {
          showtimesElement.innerHTML = '<p>No showtimes available</p>';
        }

        movieCard.appendChild(showtimesElement);
        movieCardsContainer.appendChild(movieCard);
      }
    })
    .catch((error) => {
      console.error('Error fetching movies:', error);
      const movieCardsContainer = document.getElementById('movieCardsContainer');
      movieCardsContainer.innerHTML = `<p>Error fetching movies: ${error}</p>`;
    });
}

export function getMovies() {
  loadMovies();
}

import { showtimeSchema } from './showtimesSchema.js';

export function loadMovies() {
  console.log('loadMovies called');
  fetch('http://localhost:8080/movies/all')
    .then((response) => response.json())
    .then((movies) => {
      const movieCardsContainer = document.getElementById('movieCardsContainer');
      movieCardsContainer.innerHTML = '';

      movies.forEach((movie) => {
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

        movieCardsContainer.appendChild(movieCard);
      });
    })
    .catch((error) => {
      console.error('Error fetching movies:', error);
      const movieCardsContainer = document.getElementById('movieCardsContainer');
      movieCardsContainer.innerHTML = `<p>Error fetching movies</p>`;
    });
}

export function getMovies() {
  document.getElementById('getMovies').addEventListener('submit', function (event) {
    event.preventDefault();
    loadMovies();
  });
}

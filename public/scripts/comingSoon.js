async function fetchComingSoonMovies() {
  try {
    const response = await fetch('/showtimes/coming-soon');
    if (!response.ok) {
      throw new Error('Failed to fetch movies coming soon');
    }
    const movies = await response.json();
    displayComingSoonMovies(movies);
  } catch (error) {
    console.error('Error fetching movies coming soon:', error);
  }
}

function displayComingSoonMovies(movies) {
  const comingSoonContainer = document.getElementById('comingSoonContainer');
  comingSoonContainer.innerHTML = '';

  movies.forEach((movie) => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('coming-soon-movie-banner');

    movieElement.innerHTML = `
      <div class="poster-container">  
        <img src="${movie.poster}" alt="${movie.title} Poster" class="movie-poster">
        <div class="movie-trailer-container">
          <iframe class="movie-trailer" src=${movie.trailer}></iframe>
        </div>
      </div>
      <div class="movie-info">
        <h2 class="movie-title">${movie.title}</h2>
        <h3 class="movie-tagline">${movie.tagLine}</h3>
        <p class="movie-rating">Rating: ${movie.certification} | Length: ${movie.runtime}</p>
        <p class="movie-genres">${movie.genres}</p>
        <p class="movie-scores">IMDB: ${movie.imdbScore} | Audience: ${movie.fandangoAudienceScore} | Rotten Tomatoes: ${movie.rottenTomatoes}</p>
        <p class="movie-overview">${movie.overview}</p>
        <button class="view-showtimes-button" onclick="window.location.href='../pages/getShowtimes.html?movieId=${encodeURIComponent(
          movie._id
        )}&title=${encodeURIComponent(movie.title)}&poster=${encodeURIComponent(movie.poster)}'">View Showtimes & Get Tickets</button>
        </div>
        `;

    comingSoonContainer.appendChild(movieElement);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  fetchComingSoonMovies();
});

export { fetchComingSoonMovies, displayComingSoonMovies };

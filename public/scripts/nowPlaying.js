async function fetchNowPlayingMovies() {
  try {
    const response = await fetch('http://localhost:8080/showtimes/now-playing');
    if (!response.ok) {
      throw new Error('Failed to fetch movies now playing');
    }
    const movies = await response.json();
    displayNowPlayingMovies(movies);
  } catch (error) {
    console.error('Error fetching movies now playing:', error);
  }
}

function displayNowPlayingMovies(movies) {
  const nowPlayingContainer = document.getElementById('nowPlayingContainer');
  nowPlayingContainer.innerHTML = '';

  movies.forEach((movie) => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('now-playing-movie-banner');

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

    nowPlayingContainer.appendChild(movieElement);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  fetchNowPlayingMovies();
});

export { fetchNowPlayingMovies, displayNowPlayingMovies };

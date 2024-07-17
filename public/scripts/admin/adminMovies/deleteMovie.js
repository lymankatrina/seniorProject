import { loadMovies } from './getMovies.js';

export function deleteMovie() {
  document.getElementById('deleteMovieForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const movieId = document.getElementById('deleteMovieId').value;

    fetch(`http://localhost:8080/movies/delete/${movieId}`, {
      method: 'DELETE'
    })
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('deleteMovieMessage').textContent = data;
        loadMovies();
      })
      .catch((error) => {
        document.getElementById('deleteMovieMessage').textContent = 'Error deleting movie';
        console.error('Error:', error);
      });
  });
}

import { addMovie } from './adminMovies/addMovie.js';
import { deleteMovie } from './adminMovies/deleteMovie.js';
import { getMovies } from './adminMovies/getMovies.js';
import { updateMovie } from './adminMovies/updateMovies.js';
import { addShowtime } from './adminShowtimes/addShowtime.js';
import { updateShowtime } from './adminShowtimes/updateShowtime.js';
import { deleteShowtime } from './adminShowtimes/deleteShowtime.js';
import { generateTickets } from './adminTickets/addTickets.js';

generateTickets();

document.addEventListener('DOMContentLoaded', function () {
  const getMoviesContainer = document.getElementById('getMoviesContainer');
  const newMovieContainer = document.getElementById('newMovieContainer');
  const updateMovieContainer = document.getElementById('updateMovieContainer');
  const deleteMovieContainer = document.getElementById('deleteMovieContainer');

  document.getElementById('showGetMovies').addEventListener('click', function () {
    getMoviesContainer.style.display = 'block';
    newMovieContainer.style.display = 'none';
    updateMovieContainer.style.display = 'none';
    deleteMovieContainer.style.display = 'none';

    getMovies();
  });

  document.getElementById('showNewMovie').addEventListener('click', function () {
    getMoviesContainer.style.display = 'none';
    newMovieContainer.style.display = 'block';
    updateMovieContainer.style.display = 'none';
    deleteMovieContainer.style.display = 'none';

    addMovie();
    addShowtime();
  });

  document.getElementById('showUpdateMovie').addEventListener('click', function () {
    getMoviesContainer.style.display = 'none';
    newMovieContainer.style.display = 'none';
    updateMovieContainer.style.display = 'block';
    deleteMovieContainer.style.display = 'none';

    updateMovie();
    updateShowtime();
  });

  document.getElementById('showDeleteMovie').addEventListener('click', function () {
    getMoviesContainer.style.display = 'none';
    newMovieContainer.style.display = 'none';
    updateMovieContainer.style.display = 'none';
    deleteMovieContainer.style.display = 'block';

    deleteMovie();
    deleteShowtime();
  });
});

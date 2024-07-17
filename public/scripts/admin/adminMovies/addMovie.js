import { movieSchema } from './moviesSchema.js';
import { loadMovies } from './getMovies.js';

export function addMovie() {
  const form = document.getElementById('newMovieForm');

  form.innerHTML = '';

  movieSchema.forEach((field) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add(`field-${field.id}`);

    const label = document.createElement('label');
    label.setAttribute('for', field.id);
    label.textContent = field.label;
    wrapper.appendChild(label);

    if (field.type === 'radio' || field.type === 'checkbox') {
      field.options.forEach((option) => {
        const input = document.createElement('input');
        input.classList.add('input-radio');
        input.type = field.type;
        input.id = `${field.id}=${option}`;
        input.name = field.id;
        input.value = option;
        if (field.required) input.required = true;

        const optionLabel = document.createElement('label');
        optionLabel.setAttribute('for', `${field.id}-${option}`);
        optionLabel.textContent = option;

        wrapper.appendChild(input);
        wrapper.appendChild(optionLabel);
        wrapper.appendChild(document.createElement('br'));
      });
    } else {
      const input = document.createElement('input');
      input.classList.add('input-newMovie');
      input.type = field.type;
      input.id = field.id;
      input.name = field.id;
      if (field.required) input.required = true;
      if (field.placeholder) input.placeholder = field.placeholder;
      if (field.min !== undefined) input.min = field.min;
      if (field.max !== undefined) input.max = field.max;
      if (field.step !== undefined) input.step = field.step;

      wrapper.appendChild(input);
    }

    form.appendChild(wrapper);
    form.appendChild(document.createElement('br'));
  });

  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.value = 'Create New Movie';
  form.appendChild(submitButton);
}

document.getElementById('newMovieForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const movieData = {};
  formData.forEach((value, key) => {
    if (value.trim() !== '') {
      movieData[key] = value;
    }
  });

  fetch('http://localhost:8080/movies/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(movieData)
  })
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('message').textContent = data;
      loadMovies();
    })
    .catch((error) => {
      document.getElementById('message').textContent = 'Error creating new movie';
      console.error('Error:', error);
    });
});

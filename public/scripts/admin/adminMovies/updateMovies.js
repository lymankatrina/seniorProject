import { movieSchema } from './moviesSchema.js';
import { loadMovies } from './getMovies.js';

export function updateMovie() {
  document.getElementById('searchMovieForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const response = await fetch(`/movies/search/${title}`);
    if (!response.ok) {
      alert('Movie not found');
      return;
    }
    const data = await response.json();
    console.log('Fetched Data:', data);
    if (data.length > 0) {
      generateUpdateForm(data[0]);
    } else {
      alert('No movie found');
    }
  });

  function generateUpdateForm(data) {
    const form = document.getElementById('updateMovieForm');
    form.innerHTML = '';
    const idWrapper = document.createElement('div');
    idWrapper.classList.add('field-_id');

    const idLabel = document.createElement('label');
    idLabel.setAttribute('for', '_id');
    idLabel.textContent = 'ID';
    idWrapper.appendChild(idLabel);

    const idInput = document.createElement('input');
    idInput.type = 'text';
    idInput.id = '_id';
    idInput.name = '_id';
    idInput.value = data._id;
    idInput.readOnly = true;
    idWrapper.appendChild(idInput);

    form.appendChild(idWrapper);
    form.appendChild(document.createElement('br'));

    movieSchema.forEach((field) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add(`field-${field.id}`);

      const label = document.createElement('label');
      label.setAttribute('for', field.id);
      label.textContent = field.label;
      wrapper.appendChild(label);

      if (field.type === 'radio') {
        field.options.forEach((option) => {
          const input = document.createElement('input');
          input.classList.add('input-radio');
          input.type = field.type;
          input.id = `${field.id}-${option}`;
          input.name = field.id;
          input.value = option;
          if (field.required) input.required = true;
          if (data[field.id] === option) input.checked = true;

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
        if (data[field.id]) input.value = data[field.id];

        wrapper.appendChild(input);
      }

      form.appendChild(wrapper);
      form.appendChild(document.createElement('br'));
    });

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Update Movie';
    form.appendChild(submitButton);

    document.getElementById('updateFormContainer').style.display = 'block';

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      const movieData = {};
      formData.forEach((value, key) => {
        if (key !== '_id') {
          movieData[key] = value;
        }
      });
      const _id = formData.get('_id');
      const response = await fetch(`/movies/update/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieData)
      });
      loadMovies();

      const messageDiv = document.getElementById('updateMovieMessage');
      if (response.ok) {
        const message = await response.text();
        messageDiv.textContent = message;
        console.log(message);
      } else {
        const errorMessage = await response.text();
        messageDiv.textContent = errorMessage;
      }
    });
  }
}

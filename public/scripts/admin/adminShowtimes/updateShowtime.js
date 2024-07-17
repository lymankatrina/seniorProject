import { showtimeSchema } from './showtimesSchema.js';

export function updateShowtime() {
  document.getElementById('getShowtimeForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const movieId = document.getElementById('movieId').value;
    const response = await fetch(`/showtimes/search/${movieId}`);
    if (!response.ok) {
      alert('Showtime not found');
      return;
    }
    const data = await response.json();
    console.log('Fetched Showtime Data:', data);
    console.log('Data Length:', data.length);
    if (data && data.length > 0) {
      generateUpdateShowtimeForms(data);
    } else {
      alert('No showtime found');
    }
  });

  function generateUpdateShowtimeForms(showtimes) {
    const container = document.getElementById('updateShowtimeFormContainer');
    container.innerHTML = '';

    showtimes.forEach((data) => {
      const form = document.createElement('form');
      form.classList.add('updateShowtimeForm');

      const idLabel = document.createElement('label');
      idLabel.textContent = 'Showtime ID';
      form.appendChild(idLabel);

      const idDisplayInput = document.createElement('input');
      idDisplayInput.type = 'text';
      idDisplayInput.value = data._id;
      idDisplayInput.readOnly = true;
      idDisplayInput.disabled = true;
      idDisplayInput.classList.add('Input-showtime');
      form.appendChild(idDisplayInput);

      const idInput = document.createElement('input');
      idInput.type = 'hidden';
      idInput.id = `_id-${data._id}`;
      idInput.name = '_id';
      idInput.value = data._id;
      form.appendChild(idInput);

      showtimeSchema.forEach((field) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add(`field-${field.id}`);

        const label = document.createElement('label');
        label.setAttribute('for', `${field.id}-${data._id}`);
        label.textContent = field.label;
        wrapper.appendChild(label);

        const input = document.createElement('input');
        input.classList.add('input-showtime');
        input.type = field.type;
        input.id = `${field.id}-${data._id}`;
        input.name = field.id;
        if (field.required) input.required = true;
        if (field.placeholder) input.placeholder = field.placeholder;
        if (field.min !== undefined) input.min = field.min;
        if (field.max !== undefined) input.max = field.max;
        if (field.step !== undefined) input.step = field.step;
        if (data[field.id]) input.value = data[field.id];

        wrapper.appendChild(input);
        form.appendChild(wrapper);
        form.appendChild(document.createElement('br'));
      });

      const submitButton = document.createElement('input');
      submitButton.type = 'submit';
      submitButton.value = 'Update Showtime';
      form.appendChild(submitButton);

      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const showtimeData = {};
        formData.forEach((value, key) => {
          if (key !== '_id') {
            showtimeData[key] = value;
          }
        });
        const _id = formData.get('_id');

        fetch(`/showtimes/update/${_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(showtimeData)
        })
          .then((response) => response.text())
          .then((message) => {
            const showtimesMessageDiv = document.getElementById('updateShowtimeMessage');
            showtimesMessageDiv.textContent = message;
          })
          .catch((error) => {
            const showtimesMessageDiv = document.getElementById('updateShowtimeMessage');
            showtimesMessageDiv.textContent = 'Error updating showtime';
            console.error('Error:', error);
          });
      });
      container.appendChild(form);
      container.appendChild(document.createElement('hr'));
    });
    container.style.display = 'block';
  }
}

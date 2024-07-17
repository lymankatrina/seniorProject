import { showtimeSchema } from './showtimesSchema.js';

export function addShowtime() {
  const form = document.getElementById('newShowtimesForm');

  form.innerHTML = '';

  showtimeSchema.forEach((field) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add(`field-${field.id}`);

    const label = document.createElement('label');
    label.setAttribute('for', field.id);
    label.textContent = field.label;
    wrapper.appendChild(label);

    const input = document.createElement('input');
    input.classList.add('input-newShowtime');
    input.type = field.type;
    input.id = field.id;
    input.name = field.id;
    if (field.required) input.required = true;
    if (field.placeholder) input.placeholder = field.placeholder;
    if (field.min !== undefined) input.min = field.min;
    if (field.max !== undefined) input.max = field.max;
    if (field.step !== undefined) input.step = field.step;

    wrapper.appendChild(input);

    form.appendChild(wrapper);
    form.appendChild(document.createElement('br'));
  });

  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.value = 'Create New Showtime';
  form.appendChild(submitButton);
}

document.getElementById('newShowtimesForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const showtimeData = {};
  formData.forEach((value, key) => {
    showtimeData[key] = value;
  });

  fetch('/showtimes/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(showtimeData)
  })
    .then((response) => response.text())
    .then((message) => {
      const showtimesMessageDiv = document.getElementById('showtimesMessage');
      showtimesMessageDiv.textContent = message;
    })
    .catch((error) => {
      document.getElementById('showtimesMessage').textContent = 'Error creating new showtime';
      console.error('Error:', error);
    });
});

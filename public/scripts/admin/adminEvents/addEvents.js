import { eventsSchema } from './eventsSchema.js';
import { loadEvents } from './getEvents.js';

export function addEvents() {
  const form = document.getElementById('newEventsForm');

  form.innerHTML = '';

  eventsSchema.forEach((field) => {
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
      input.classList.add('input-newEvents');
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
  submitButton.value = 'Create New Events';
  form.appendChild(submitButton);
}

document.getElementById('newEventsForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const eventsData = {};
  formData.forEach((value, key) => {
    if (value.trim() !== '') {
      eventsData[key] = value;
    }
  });

  fetch('http://localhost:8080/events/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventsData)
  })
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('message').textContent = data;
      loadEvents();
    })
    .catch((error) => {
      document.getElementById('message').textContent = 'Error creating new events item';
      console.error('Error:', error);
    });
});

import { newsItemsSchema } from './newsItemsSchema.js';
import { loadNewsItems } from './getNewsItems.js';

export function addNewsItems() {
  const form = document.getElementById('newNewsItemsForm');
  form.innerHTML = '';

  newsItemsSchema.forEach((field) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add(`field-${field.id}`);

    const label = document.createElement('label');
    label.setAttribute('for', field.id);
    label.textContent = field.label;
    wrapper.appendChild(label);

    let input;

    if (field.type === 'radio') {
      field.options.forEach((option) => {
        const radioWrapper = document.createElement('div');
        radioWrapper.classList.add('radio-wrapper');

        input = document.createElement('input');
        input.classList.add(`input-${field.type}`);
        input.type = field.type;
        input.id = `${field.id}=${option}`;
        input.name = field.id;
        input.value = option;
        if (field.required) input.required = true;

        const optionLabel = document.createElement('label');
        optionLabel.setAttribute('for', `${field.id}-${option}`);
        optionLabel.textContent = option;

        radioWrapper.appendChild(input);
        radioWrapper.appendChild(optionLabel);
        wrapper.appendChild(radioWrapper);
      });
    } else if (field.type === 'checkbox') {
      input = document.createElement('input');
      input.classList.add(`input-${field.type}`);
      input.type = field.type;
      input.id = field.id;
      input.name = field.id;
      if (field.required) input.required = true;
    } else if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.classList.add('input-newNewsItems');
      input.id = field.id;
      input.name = field.id;
      if (field.required) input.required = true;
      if (field.placeholder) input.placeholder = field.placeholder;
    } else {
      input = document.createElement('input');
      input.classList.add('input-newNewsItems');
      input.type = field.type;
      input.id = field.id;
      input.name = field.id;
      if (field.required) input.required = true;
      if (field.placeholder) input.placeholder = field.placeholder;
      if (field.min !== undefined) input.min = field.min;
      if (field.max !== undefined) input.max = field.max;
      if (field.step !== undefined) input.step = field.step;
    }

    wrapper.appendChild(input);
    form.appendChild(wrapper);
    form.appendChild(document.createElement('br'));
  });

  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.value = 'Create New News Items';
  form.appendChild(submitButton);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const newNewsItemsData = {};
    formData.forEach((value, key) => {
      if (key === 'isActive') {
        newNewsItemsData[key] = value === 'on';
      } else {
        newNewsItemsData[key] = value;
      }
    });

    if (!formData.has('isActive')) {
      newNewsItemsData.isActive = false;
    }

    fetch('/news/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newNewsItemsData)
    })
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('newNewsItemsMessage').textContent = data;
        loadNewsItems();
      })
      .catch((error) => {
        document.getElementById('newNewsItemsMessage').textContent = 'Error creating new news items';
        console.error('Error:', error);
      });
  });
}

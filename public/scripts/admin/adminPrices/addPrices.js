import { priceSchema } from './priceSchema.js';
import { loadPrices } from './getPrices.js';

export function addPrice() {
  const form = document.getElementById('newPriceForm');
  form.innerHTML = '';

  priceSchema.forEach((field) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add(`field-${field.id}`);

    const label = document.createElement('label');
    label.setAttribute('for', field.id);
    label.textContent = field.label;
    wrapper.appendChild(label);

    let input;
    if (field.type === 'checkbox') {
      input = document.createElement('input');
      input.classList.add(`input-${field.type}`);
      input.type = field.type;
      input.id = field.id;
      input.name = field.id;
    } else {
      input = document.createElement('input');
      input.classList.add('input-newPrice');
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
  submitButton.value = 'Create New Price';
  form.appendChild(submitButton);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const newPriceData = {};
    formData.forEach((value, key) => {
      if (key === 'isAdmin') {
        newPriceData[key] = value === 'on';
      } else {
        newPriceData[key] = value;
      }
    });

    if (!formData.has('isAdmin')) {
      newPriceData.isAdmin = false;
    }

    fetch('/prices/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPriceData)
    })
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('newPriceMessage').textContent = data;
        loadPrices();
      })
      .catch((error) => {
        document.getElementById('newPriceMessage').textContent = 'Error creating new price';
        console.error('Error:', error);
      });
  });
}

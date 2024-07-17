import { priceSchema } from './priceSchema.js';
import { loadPrices } from './getPrices.js';

export function updatePrice() {
  document.getElementById('getPriceForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const _id = document.getElementById('_id').value;
    const response = await fetch(`/prices/${_id}`);
    if (!response.ok) {
      alert('Price not found');
      return;
    }
    const data = await response.json();
    console.log('Fetched Price Data:', data);
    console.log('Data Length:', data.length);
    if (data && Object.keys(data).length > 0) {
      generateUpdatePriceForm(data);
    } else {
      alert('No price found');
    }
  });

  function generateUpdatePriceForm(data) {
    const form = document.getElementById('updatePriceForm');
    form.innerHTML = '';

    const idInput = document.createElement('input');
    idInput.type = 'hidden';
    idInput.id = '_id';
    idInput.name = '_id';
    idInput.value = data._id;
    form.appendChild(idInput);

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
        input.checked = data[field.id];
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
        input.value = data[field.id] || '';
      }
      wrapper.appendChild(input);
      form.appendChild(wrapper);
      form.appendChild(document.createElement('br'));
    });

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Update Price';
    form.appendChild(submitButton);

    document.getElementById('updatePriceFormContainer').style.display = 'block';
  }

  document.getElementById('updatePriceForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const updatePriceData = {};
    formData.forEach((value, key) => {
      if (key === 'isAdmin') {
        updatePriceData[key] = value === 'on';
      } else {
        updatePriceData[key] = value;
      }
    });

    if (!formData.has('isAdmin')) {
      updatePriceData.isAdmin = false;
    }

    const _id = updatePriceData._id;
    delete updatePriceData['_id'];
    const response = await fetch(`/prices/update/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePriceData)
    });
    loadPrices();

    const updatePriceMessageDiv = document.getElementById('updatePriceMessage');
    if (response.ok) {
      const message = await response.text();
      updatePriceMessageDiv.textContent = message;
    } else {
      const errorMessage = await response.text();
      updatePriceMessageDiv.textContent = errorMessage;
    }
  });
}

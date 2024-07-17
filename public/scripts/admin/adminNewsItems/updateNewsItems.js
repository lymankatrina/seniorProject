import { newsItemsSchema } from './newsItemsSchema.js';
import { loadNewsItems } from './getNewsItems.js';

export function updateNewsItems() {
  document.getElementById('searchNewsItemsForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const newsItemId = document.getElementById('newsItemId').value;
    const response = await fetch(`/news/${newsItemId}`);
    if (!response.ok) {
      alert('News Item not found');
      return;
    }
    const data = await response.json();
    console.log('Fetched Data:', data);
    generateUpdateForm(data);
  });

  function generateUpdateForm(data) {
    const form = document.getElementById('updateNewsItemsForm');
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
          input.classList.add('input-${field.type}');
          input.type = field.type;
          input.id = `${field.id}-${option}`;
          input.name = field.id;
          input.value = option;
          if (field.required) input.required = true;
          if (data[field.id] === option) input.checked = true;

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
        input.checked = data[field.id];
        if (field.required) input.required = true;
      } else if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.classList.add('input-newNewsItems');
        input.id = field.id;
        input.name = field.id;
        if (field.required) input.required = true;
        if (field.placeholder) input.placeholder = field.placeholder;
        input.value = data[field.id] || '';
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
        input.value = data[field.id] || '';
      }
      
      wrapper.appendChild(input);
      form.appendChild(wrapper);
      form.appendChild(document.createElement('br'));
    });

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Update News Item';
    form.appendChild(submitButton);

    document.getElementById('updateFormContainer').style.display = 'block';

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      const newsItemData = {};
      formData.forEach((value, key) => {
      if (key === 'isActive') {
        newsItemData[key] = value === 'on';
      } else {
        newsItemData[key] = value;
      }
    });

    if (!formData.has('isActive')) {
      newsItemData.isActive = false;
    }
      const _id = formData.get('_id');
      delete newsItemData['_id'];
      const response = await fetch(`/news/update/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newsItemData)
      });
      loadNewsItems();

      const messageDiv = document.getElementById('updateNewsItemsMessage');
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

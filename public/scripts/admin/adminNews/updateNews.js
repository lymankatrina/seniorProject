import { newsSchema } from './newsSchema.js';
import { loadNews } from './getNews.js';

export function updateNews() {
  document.getElementById('searchNewsForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const newsId = document.getElementById('newsId').value;
    const response = await fetch(`http://localhost:8080/news/${newsId}`);
    if (!response.ok) {
      alert('News not found');
      return;
    }
    const data = await response.json();
    console.log('Fetched Data:', data);
    generateUpdateForm(data);
  });

  function generateUpdateForm(data) {
    const form = document.getElementById('updateNewsForm');
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

    newsSchema.forEach((field) => {
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
        input.classList.add('input-newNews');
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
    submitButton.value = 'Update News Item';
    form.appendChild(submitButton);

    document.getElementById('updateFormContainer').style.display = 'block';

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      const newsData = {};
      formData.forEach((value, key) => {
        if (key !== '_id') {
          newsData[key] = value;
        }
      });
      const _id = formData.get('_id');
      const response = await fetch(`http://localhost:8080/news/update/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newsData)
      });
      loadNews();

      const messageDiv = document.getElementById('updateNewsMessage');
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

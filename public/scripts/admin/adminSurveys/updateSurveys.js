import { surveySchema } from './surveySchema.js';
import { loadSurveys } from './getSurveys.js';

export function updateSurvey() {
  document.getElementById('getSurveyForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const _id = document.getElementById('_id').value;
    const response = await fetch(`/surveys/${_id}`);
    if (!response.ok) {
      alert('Survey not found');
      return;
    }
    const data = await response.json();
    console.log('Fetched Survey Data:', data);
    console.log('Data Length:', data.length);
    if (data && Object.keys(data).length > 0) {
      generateUpdateSurveyForm(data);
    } else {
      alert('No survey found');
    }
  });

  function generateUpdateSurveyForm(data) {
    const form = document.getElementById('updateSurveyForm');
    form.innerHTML = '';

    const idInput = document.createElement('input');
    idInput.type = 'hidden';
    idInput.id = '_id';
    idInput.name = '_id';
    idInput.value = data._id;
    form.appendChild(idInput);

    surveySchema.forEach((field) => {
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
        input.classList.add('input-newSurvey');
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
    submitButton.value = 'Update Survey';
    form.appendChild(submitButton);

    document.getElementById('updateSurveyFormContainer').style.display = 'block';
  }

  document.getElementById('updateSurveyForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const updateSurveyData = {};
    formData.forEach((value, key) => {
      if (key === 'isActive') {
        updateSurveyData[key] = value === 'on';
      } else {
        updateSurveyData[key] = value;
      }
    });

    if (!formData.has('isActive')) {
      updateSurveyData.isActive = false;
    }

    const _id = updateSurveyData._id;
    delete updateSurveyData['_id'];
    const response = await fetch(`/surveys/update/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateSurveyData)
    });
    loadSurveys();

    const updateSurveyMessageDiv = document.getElementById('updateSurveyMessage');
    if (response.ok) {
      const message = await response.text();
      updateSurveyMessageDiv.textContent = message;
    } else {
      const errorMessage = await response.text();
      updateSurveyMessageDiv.textContent = errorMessage;
    }
  });
}

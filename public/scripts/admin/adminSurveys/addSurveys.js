import { surveySchema } from './surveySchema.js';
import { loadSurveys } from './getSurveys.js';

export function addSurvey() {
  const form = document.getElementById('newSurveyForm');
  form.innerHTML = '';

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
    }

    wrapper.appendChild(input);
    form.appendChild(wrapper);
    form.appendChild(document.createElement('br'));
  });

  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.value = 'Create New Survey';
  form.appendChild(submitButton);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const newSurveyData = {};
    formData.forEach((value, key) => {
      if (key === 'isActive') {
        newSurveyData[key] = value === 'on';
      } else {
        newSurveyData[key] = value;
      }
    });

    if (!formData.has('isActive')) {
      newSurveyData.isAdmin = false;
    }

    fetch('http://localhost:8080/surveys/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSurveyData)
    })
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('newSurveyMessage').textContent = data;
        loadSurveys();
      })
      .catch((error) => {
        document.getElementById('newSurveyMessage').textContent = 'Error creating new survey';
        console.error('Error:', error);
      });
  });
}

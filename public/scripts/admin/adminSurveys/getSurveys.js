import { surveySchema } from './surveySchema.js';

export function loadSurveys() {
  fetch('/surveys/all')
    .then((response) => response.json())
    .then((surveys) => {
      const surveyCardsContainer = document.getElementById('surveyCardsContainer');
      surveyCardsContainer.innerHTML = '';

      surveys.forEach((survey) => {
        const surveyCard = document.createElement('div');
        surveyCard.classList.add('survey-card');

        const idFieldElement = document.createElement('p');
        idFieldElement.classList.add('_id');
        idFieldElement.innerHTML = `<strong>ID:</strong> ${survey._id}`;
        surveyCard.appendChild(idFieldElement);

        surveySchema.forEach((field) => {
          const fieldElement = document.createElement('p');
          fieldElement.classList.add(field.id);

          let fieldValue = survey[field.id];
          if (fieldValue === false) {
            fieldValue = 'false';
          } else if (fieldValue === true) {
            fieldValue = 'true';
          }

          fieldElement.innerHTML = `<strong>${field.label}:</strong> ${fieldValue || ''}`;
          surveyCard.appendChild(fieldElement);
        });

        surveyCardsContainer.appendChild(surveyCard);
      });
    })
    .catch((error) => {
      console.error('Error fetching surveys:', error);
      const surveyCardsContainer = document.getElementById('surveyCardsContainer');
      surveyCardsContainer.innerHTML = `<p>Error fetching surveys</p>`;
    });
}

export function getSurveys() {
  document.getElementById('getSurveys').addEventListener('submit', function (event) {
    event.preventDefault();
    loadSurveys();
  });
}

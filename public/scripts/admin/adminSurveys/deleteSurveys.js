import { loadSurveys } from './getSurveys.js';

export function deleteSurvey() {
  document.getElementById('deleteSurveyForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const surveyId = document.getElementById('deleteSurveyId').value;

    fetch(`/surveys/delete/${surveyId}`, {
      method: 'DELETE'
    })
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('deleteSurveyMessage').textContent = data;
        loadSurveys();
      })
      .catch((error) => {
        document.getElementById('deleteSurveyMessage').textContent = 'Error deleting survey';
        console.error('Error:', error);
      });
  });
}

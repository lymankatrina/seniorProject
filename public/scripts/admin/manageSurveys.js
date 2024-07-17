import { addSurvey } from './adminSurveys/addSurveys.js';
import { deleteSurvey } from './adminSurveys/deleteSurveys.js';
import { getSurveys } from './adminSurveys/getSurveys.js';
import { updateSurvey } from './adminSurveys/updateSurveys.js';

document.addEventListener('DOMContentLoaded', function () {
  const getSurveysContainer = document.getElementById('getSurveysContainer');
  const newSurveyContainer = document.getElementById('newSurveyContainer');
  const updateSurveyContainer = document.getElementById('updateSurveyContainer');
  const deleteSurveyContainer = document.getElementById('deleteSurveyContainer');

  document.getElementById('showGetSurveys').addEventListener('click', function () {
    getSurveysContainer.style.display = 'block';
    newSurveyContainer.style.display = 'none';
    updateSurveyContainer.style.display = 'none';
    deleteSurveyContainer.style.display = 'none';

    getSurveys();
  });

  document.getElementById('showNewSurvey').addEventListener('click', function () {
    getSurveysContainer.style.display = 'none';
    newSurveyContainer.style.display = 'block';
    updateSurveyContainer.style.display = 'none';
    deleteSurveyContainer.style.display = 'none';

    addSurvey();
  });

  document.getElementById('showUpdateSurvey').addEventListener('click', function () {
    getSurveysContainer.style.display = 'none';
    newSurveyContainer.style.display = 'none';
    updateSurveyContainer.style.display = 'block';
    deleteSurveyContainer.style.display = 'none';

    updateSurvey();
  });

  document.getElementById('showDeleteSurvey').addEventListener('click', function () {
    getSurveysContainer.style.display = 'none';
    newSurveyContainer.style.display = 'none';
    updateSurveyContainer.style.display = 'none';
    deleteSurveyContainer.style.display = 'block';

    deleteSurvey();
  });
});

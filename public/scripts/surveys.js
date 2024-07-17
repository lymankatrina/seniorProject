async function fetchActiveSurveys() {
  try {
    const response = await fetch('http://localhost:8080/surveys/active');
    if (!response.ok) {
      throw new Error('Failed to fetch active surveys');
    }
    const activeSurveys = await response.json();
    displayActiveSurveys(activeSurveys);
  } catch (error) {
    console.error('Error fetching active surveys:', error);
  }
}

function displayActiveSurveys(activeSurveys) {
  const activeSurveysContainer = document.getElementById('activeSurveysContainer');
  activeSurveysContainer.innerHTML = '';

  if (activeSurveys.length > 0) {
    const heading = document.createElement('h2');
    heading.textContent = 'Surveys';
    activeSurveysContainer.appendChild(heading);
  }

  activeSurveys.forEach((activeSurvey) => {
    const activeSurveyElement = document.createElement('div');
    activeSurveyElement.classList.add('active-survey-banner');

    activeSurveyElement.innerHTML = `
    <iframe src="${activeSurvey.surveyLink}" width="100%" height="400px" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>
    `;

    activeSurveysContainer.appendChild(activeSurveyElement);
  });
}

function displayError(message) {
  const activeSurveysMessage = document.getElementById('activeSurveysMessage');
  activeSurveysMessage.innerHTML = '';

  const errorMessage = document.createElement('p');
  errorMessage.classList.add('error-message');
  errorMessage.textContent = message;

  activeSurveysMessage.appendChild(errorMessage);
}

document.addEventListener('DOMContentLoaded', function () {
  fetchActiveSurveys();
});

export { fetchActiveSurveys, displayActiveSurveys };

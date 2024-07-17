import { newsSchema } from './newsSchema.js';

export function loadNews() {
  console.log('loadNews called');
  fetch('http://localhost:8080/news/all')
    .then((response) => response.json())
    .then(async (news) => {
      const newsItemsContainer = document.getElementById('newsItemsContainer');
      newsItemsContainer.innerHTML = '';

      for (const newsItem of news) {
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card');

        const idFieldElement = document.createElement('p');
        idFieldElement.classList.add('_id');
        idFieldElement.innerHTML = `<strong>ID:</strong> ${newsItem._id}`;
        newsCard.appendChild(idFieldElement);

        newsSchema.forEach((field) => {
          let fieldElement;

          if (field.type === 'url') {
            if (field.id === 'image') {
              fieldElement = document.createElement('img');
              fieldElement.src = newsItem[field.id];
              fieldElement.alt = `${newsItem.title} Image`;
              fieldElement.classList.add(field.id);
            } else if (field.id === 'link') {
              fieldElement = document.createElement('a');
              fieldElement.href = newsItem[field.id];
              fieldElement.title = `${newsItem.title} Link`;
              fieldElement.classList.add(field.id);
              fieldElement.textContent = `${newsItem[field.id]}`;
            }
          } else {
            fieldElement = document.createElement('p');
            fieldElement.classList.add(field.id);

            let fieldValue = newsItem[field.id];
            if (fieldValue === false) {
              fieldValue = 'false';
            } else if (fieldValue === true) {
              fieldValue = 'true';
            }

            fieldElement.innerHTML = `<strong>${field.label}:</strong> ${fieldValue || ''}`;
          }

          newsCard.appendChild(fieldElement);
        });

        newsItemsContainer.appendChild(newsCard);
      }
    })
    .catch((error) => {
      console.error('Error fetching news:', error);
      const newsItemsContainer = document.getElementById('newsItemsContainer');
      newsItemsContainer.innerHTML = `<p>Error fetching news items: ${error}</p>`;
    });
}

export function getNews() {
  loadNews();
}

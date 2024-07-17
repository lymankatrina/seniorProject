import { newsItemsSchema } from './newsItemsSchema.js';

export function loadNewsItems() {
  console.log('loadNewsItems called');
  fetch('/news/all')
    .then((response) => response.json())
    .then(async (newsItems) => {
      const newsItemsContainer = document.getElementById('NewsItemsContainer');
      newsItemsContainer.innerHTML = '';

      for (const newsItem of newsItems) {
        const newsItemCard = document.createElement('div');
        newsItemCard.classList.add('news-item-card');

        const idFieldElement = document.createElement('p');
        idFieldElement.classList.add('_id');
        idFieldElement.innerHTML = `<strong>ID:</strong> ${newsItem._id}`;
        newsItemCard.appendChild(idFieldElement);

        newsItemsSchema.forEach((field) => {
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
              fieldElement.text = `${newsItem[field.id]}`;
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

          newsItemCard.appendChild(fieldElement);
        });

        newsItemsContainer.appendChild(newsItemCard);
      }
    })
    .catch((error) => {
      console.error('Error fetching news items:', error);
      const newsItemsContainer = document.getElementById('NewsItemsContainer');
      newsItemsContainer.innerHTML = `<p>Error fetching news items: ${error}</p>`;
    });
}

export function getNewsItems() {
  loadNewsItems();
}

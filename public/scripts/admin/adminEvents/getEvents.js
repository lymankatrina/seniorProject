import { eventsSchema } from './eventsSchema.js';

export function loadEvents() {
  console.log('loadEvents called');
  fetch('http://localhost:8080/events/all')
    .then((response) => response.json())
    .then(async (events) => {
      const eventsItemsContainer = document.getElementById('eventsItemsContainer');
      eventsItemsContainer.innerHTML = '';

      for (const eventsItem of events) {
        const eventsCard = document.createElement('div');
        eventsCard.classList.add('events-card');

        const idFieldElement = document.createElement('p');
        idFieldElement.classList.add('_id');
        idFieldElement.innerHTML = `<strong>ID:</strong> ${eventsItem._id}`;
        eventsCard.appendChild(idFieldElement);

        eventsSchema.forEach((field) => {
          let fieldElement;

          if (field.type === 'url') {
            if (field.id === 'image') {
              fieldElement = document.createElement('img');
              fieldElement.src = eventsItem[field.id];
              fieldElement.alt = `${eventsItem.title} Image`;
              fieldElement.classList.add(field.id);
            } else if (field.id === 'link') {
              fieldElement = document.createElement('a');
              fieldElement.href = eventsItem[field.id];
              fieldElement.title = `${eventsItem.title} Link`;
              fieldElement.classList.add(field.id);
              fieldElement.text = `${eventsItem[field.id]}`;
            }
          } else {
            fieldElement = document.createElement('p');
            fieldElement.classList.add(field.id);

            let fieldValue = eventsItem[field.id];
            if (fieldValue === false) {
              fieldValue = 'false';
            } else if (fieldValue === true) {
              fieldValue = 'true';
            }

            fieldElement.innerHTML = `<strong>${field.label}:</strong> ${fieldValue || ''}`;
          }

          eventsCard.appendChild(fieldElement);
        });

        eventsItemsContainer.appendChild(eventsCard);
      }
    })
    .catch((error) => {
      console.error('Error fetching events:', error);
      const eventsItemsContainer = document.getElementById('eventsItemsContainer');
      eventsItemsContainer.innerHTML = `<p>Error fetching events items: ${error}</p>`;
    });
}

export function getEvents() {
  loadEvents();
}

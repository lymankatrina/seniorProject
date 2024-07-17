import { priceSchema } from './priceSchema.js';

export function loadPrices() {
  fetch('http://localhost:8080/prices/')
    .then((response) => response.json())
    .then((prices) => {
      const priceCardsContainer = document.getElementById('priceCardsContainer');
      priceCardsContainer.innerHTML = '';

      prices.forEach((price) => {
        const priceCard = document.createElement('div');
        priceCard.classList.add('price-card');

        const idFieldElement = document.createElement('p');
        idFieldElement.classList.add('_id');
        idFieldElement.innerHTML = `<strong>ID:</strong> ${price._id}`;
        priceCard.appendChild(idFieldElement);

        priceSchema.forEach((field) => {
          const fieldElement = document.createElement('p');
          fieldElement.classList.add(field.id);

          let fieldValue = price[field.id];
          if (fieldValue === false) {
            fieldValue = 'false';
          } else if (fieldValue === true) {
            fieldValue = 'true';
          }

          fieldElement.innerHTML = `<strong>${field.label}:</strong> ${fieldValue || ''}`;
          priceCard.appendChild(fieldElement);
        });

        priceCardsContainer.appendChild(priceCard);
      });
    })
    .catch((error) => {
      console.error('Error fetching prices:', error);
      const priceCardsContainer = document.getElementById('priceCardsContainer');
      priceCardsContainer.innerHTML = `<p>Error fetching prices</p>`;
    });
}

export function getPrices() {
  document.getElementById('getPrices').addEventListener('submit', function (event) {
    event.preventDefault();
    loadPrices();
  });
}

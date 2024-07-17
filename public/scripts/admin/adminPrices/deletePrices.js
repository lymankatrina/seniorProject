import { loadPrices } from './getPrices.js';

export function deletePrice() {
  document.getElementById('deletePriceForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const priceId = document.getElementById('deletePriceId').value;

    fetch(`/prices/delete/${priceId}`, {
      method: 'DELETE'
    })
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('deletePriceMessage').textContent = data;
        loadPrices();
      })
      .catch((error) => {
        document.getElementById('deletePriceMessage').textContent = 'Error deleting price';
        console.error('Error:', error);
      });
  });
}

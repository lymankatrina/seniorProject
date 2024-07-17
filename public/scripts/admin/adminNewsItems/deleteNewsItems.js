import { loadNewsItems } from './getNewsItems.js';

export function deleteNewsItems() {
  document.getElementById('deleteNewsItemsForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const newsItemsId = document.getElementById('deleteNewsItemsId').value;

    fetch(`/news/delete/${newsItemsId}`, {
      method: 'DELETE'
    })
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('deleteNewsItemsMessage').textContent = data;
        loadNewsItems();
      })
      .catch((error) => {
        document.getElementById('deleteNewsItemsMessage').textContent = 'Error deleting news item';
        console.error('Error:', error);
      });
  });
}

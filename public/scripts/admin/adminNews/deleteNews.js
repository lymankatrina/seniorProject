import { loadNews } from './getNews.js';

export function deleteNews() {
  document.getElementById('deleteNewsForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const newsId = document.getElementById('deleteNewsId').value;

    fetch(`http://localhost:8080/newss/delete/${newsId}`, {
      method: 'DELETE'
    })
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('deleteNewsMessage').textContent = data;
        loadNews();
      })
      .catch((error) => {
        document.getElementById('deleteNewsMessage').textContent = 'Error deleting news item';
        console.error('Error:', error);
      });
  });
}

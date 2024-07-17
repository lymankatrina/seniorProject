import { addNews } from './adminNews/addNews.js';
import { deleteNews } from './adminNews/deleteNews.js';
import { getNews } from './adminNews/getNews.js';
import { updateNews } from './adminNews/updateNews.js';

document.addEventListener('DOMContentLoaded', function () {
  const getNewsItemsContainer = document.getElementById('getNewsItemsContainer');
  const newNewsItemsContainer = document.getElementById('newNewsItemsContainer');
  const updateNewsItemsContainer = document.getElementById('updateNewsItemsContainer');
  const deleteNewsItemsContainer = document.getElementById('deleteNewsItemsContainer');

  document.getElementById('showGetNews').addEventListener('click', function () {
    getNewsItemsContainer.style.display = 'block';
    newNewsItemsContainer.style.display = 'none';
    updateNewsItemsContainer.style.display = 'none';
    deleteNewsItemsContainer.style.display = 'none';

    getNews();
  });

  document.getElementById('showNewNews').addEventListener('click', function () {
    getNewsItemsContainer.style.display = 'none';
    newNewsItemsContainer.style.display = 'block';
    updateNewsItemsContainer.style.display = 'none';
    deleteNewsItemsContainer.style.display = 'none';

    addNews();
  });

  document.getElementById('showUpdateNews').addEventListener('click', function () {
    getNewsItemsContainer.style.display = 'none';
    newNewsItemsContainer.style.display = 'none';
    updateNewsItemsContainer.style.display = 'block';
    deleteNewsItemsContainer.style.display = 'none';

    updateNews();
  });

  document.getElementById('showDeleteNews').addEventListener('click', function () {
    getNewsItemsContainer.style.display = 'none';
    newNewsItemsContainer.style.display = 'none';
    updateNewsItemsContainer.style.display = 'none';
    deleteNewsItemsContainer.style.display = 'block';

    deleteNews();
  });
});

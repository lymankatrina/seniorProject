import { addNewsItems } from './adminNewsItems/addNewsItems.js';
import { deleteNewsItems } from './adminNewsItems/deleteNewsItems.js';
import { getNewsItems } from './adminNewsItems/getNewsItems.js';
import { updateNewsItems } from './adminNewsItems/updateNewsItems.js';

document.addEventListener('DOMContentLoaded', function () {
  const getNewsItemsContainer = document.getElementById('getNewsItemsContainer');
  const newNewsItemsContainer = document.getElementById('newNewsItemsContainer');
  const updateNewsItemsContainer = document.getElementById('updateNewsItemsContainer');
  const deleteNewsItemsContainer = document.getElementById('deleteNewsItemsContainer');

  document.getElementById('showGetNewsItems').addEventListener('click', function () {
    getNewsItemsContainer.style.display = 'block';
    newNewsItemsContainer.style.display = 'none';
    updateNewsItemsContainer.style.display = 'none';
    deleteNewsItemsContainer.style.display = 'none';

    getNewsItems();
  });

  document.getElementById('showNewNewsItems').addEventListener('click', function () {
    getNewsItemsContainer.style.display = 'none';
    newNewsItemsContainer.style.display = 'block';
    updateNewsItemsContainer.style.display = 'none';
    deleteNewsItemsContainer.style.display = 'none';

    addNewsItems();
  });

  document.getElementById('showUpdateNewsItems').addEventListener('click', function () {
    getNewsItemsContainer.style.display = 'none';
    newNewsItemsContainer.style.display = 'none';
    updateNewsItemsContainer.style.display = 'block';
    deleteNewsItemsContainer.style.display = 'none';

    updateNewsItems();
  });

  document.getElementById('showDeleteNewsItems').addEventListener('click', function () {
    getNewsItemsContainer.style.display = 'none';
    newNewsItemsContainer.style.display = 'none';
    updateNewsItemsContainer.style.display = 'none';
    deleteNewsItemsContainer.style.display = 'block';

    deleteNewsItems();
  });
});

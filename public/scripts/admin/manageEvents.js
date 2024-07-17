import { addEvents } from './adminEvents/addEvents.js';
import { deleteEvents } from './adminEvents/deleteEvents.js';
import { getEvents } from './adminEvents/getEvents.js';
import { updateEvents } from './adminEvents/updateEvents.js';

document.addEventListener('DOMContentLoaded', function () {
  const getEventsItemsContainer = document.getElementById('getEventsItemsContainer');
  const newEventsItemsContainer = document.getElementById('newEventsItemsContainer');
  const updateEventsItemsContainer = document.getElementById('updateEventsItemsContainer');
  const deleteEventsItemsContainer = document.getElementById('deleteEventsItemsContainer');

  document.getElementById('showGetEvents').addEventListener('click', function () {
    getEventsItemsContainer.style.display = 'block';
    newEventsItemsContainer.style.display = 'none';
    updateEventsItemsContainer.style.display = 'none';
    deleteEventsItemsContainer.style.display = 'none';

    getEvents();
  });

  document.getElementById('showNewEvents').addEventListener('click', function () {
    getEventsItemsContainer.style.display = 'none';
    newEventsItemsContainer.style.display = 'block';
    updateEventsItemsContainer.style.display = 'none';
    deleteEventsItemsContainer.style.display = 'none';

    addEvents();
  });

  document.getElementById('showUpdateEvents').addEventListener('click', function () {
    getEventsItemsContainer.style.display = 'none';
    newEventsItemsContainer.style.display = 'none';
    updateEventsItemsContainer.style.display = 'block';
    deleteEventsItemsContainer.style.display = 'none';

    updateEvents();
  });

  document.getElementById('showDeleteEvents').addEventListener('click', function () {
    getEventsItemsContainer.style.display = 'none';
    newEventsItemsContainer.style.display = 'none';
    updateEventsItemsContainer.style.display = 'none';
    deleteEventsItemsContainer.style.display = 'block';

    deleteEvents();
  });
});

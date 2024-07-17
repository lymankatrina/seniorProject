import { loadEvents } from './getEvents.js';

export function deleteEvents() {
  document.getElementById('deleteEventsForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const eventsId = document.getElementById('deleteEventsId').value;

    fetch(`http://localhost:8080/events/delete/${eventsId}`, {
      method: 'DELETE'
    })
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('deleteEventsMessage').textContent = data;
        loadEvents();
      })
      .catch((error) => {
        document.getElementById('deleteEventsMessage').textContent = 'Error deleting events item';
        console.error('Error:', error);
      });
  });
}

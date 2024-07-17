async function fetchCurrentPublicEvents() {
  try {
    const response = await fetch('http://localhost:8080/events/current');
    if (!response.ok) {
      throw new Error('Failed to fetch current public events');
    }
    const currentPublicEvents = await response.json();
    displayCurrentPublicEvents(currentPublicEvents);
  } catch (error) {
    console.error('Error fetching current public events:', error);
  }
}

function displayCurrentPublicEvents(currentPublicEvents) {
  const currentPublicEventsContainer = document.getElementById('currentPublicEventsContainer');
  currentPublicEventsContainer.innerHTML = '';

  if (currentPublicEvents.length > 0) {
    const heading = document.createElement('h2');
    heading.textContent = 'Current Events';
    currentPublicEventsContainer.appendChild(heading);
  }

  currentPublicEvents.forEach((currentPublicEvent) => {
    const currentPublicEventElement = document.createElement('div');
    currentPublicEventElement.classList.add('current-public-event-banner');

    currentPublicEventElement.innerHTML = `
    <div class="event-content">
      <div class="event-image-container">
        <img class="event-image" src="${currentPublicEvent.image}" alt="${currentPublicEvent.title}" />
      </div>
      <div class="event-details">
        <div class="event-header">
          <h3 class="event-title">${currentPublicEvent.title}</h3>
          <h4 class="event-tagline">${currentPublicEvent.tagline}</h4>
        </div>
        <div class="event-body">
          <p class="event-description">${currentPublicEvent.description}</p>
          <p class="event-dates"><strong>Dates:</strong> ${new Date(currentPublicEvent.startDate).toLocaleDateString()} - ${new Date(currentPublicEvent.endDate).toLocaleDateString()}</p>
          <p class="event-time"><strong>Time:</strong> ${currentPublicEvent.startTime} - ${currentPublicEvent.endTime}</p>
        </div>
        <div class="event-footer">
          <p class="event-read-more"><a href="${currentPublicEvent.link}" target="_blank">More Details</a></p>
        </div>
      </div>
    </div>
    `;

    currentPublicEventsContainer.appendChild(currentPublicEventElement);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  fetchCurrentPublicEvents();
});

export { fetchCurrentPublicEvents, displayCurrentPublicEvents };

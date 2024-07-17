import { userSchema } from './userSchema.js';

export function loadUsers() {
  fetch('/users/all')
    .then((response) => response.json())
    .then((users) => {
      const userCardsContainer = document.getElementById('userCardsContainer');
      userCardsContainer.innerHTML = '';

      users.forEach((user) => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');

        const idFieldElement = document.createElement('p');
        idFieldElement.classList.add('_id');
        idFieldElement.innerHTML = `<strong>ID:</strong> ${user._id}`;
        userCard.appendChild(idFieldElement);

        userSchema.forEach((field) => {
          const fieldElement = document.createElement('p');
          fieldElement.classList.add(field.id);

          let fieldValue = user[field.id];
          if (fieldValue === false) {
            fieldValue = 'false';
          } else if (fieldValue === true) {
            fieldValue = 'true';
          }

          fieldElement.innerHTML = `<strong>${field.label}:</strong> ${fieldValue || ''}`;
          userCard.appendChild(fieldElement);
        });

        userCardsContainer.appendChild(userCard);
      });
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
      const userCardsContainer = document.getElementById('userCardsContainer');
      userCardsContainer.innerHTML = `<p>Error fetching users</p>`;
    });
}

export function getUsers() {
  document.getElementById('getUsers').addEventListener('submit', function (event) {
    event.preventDefault();
    loadUsers();
  });
}

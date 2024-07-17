import { loadUsers } from './getUsers.js';

export function deleteUser() {
  document.getElementById('deleteUserForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const userId = document.getElementById('deleteUserId').value;

    fetch(`http://localhost:8080/users/delete/${userId}`, {
      method: 'DELETE'
    })
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('deleteUserMessage').textContent = data;
        loadUsers();
      })
      .catch((error) => {
        document.getElementById('deleteUserMessage').textContent = 'Error deleting user';
        console.error('Error:', error);
      });
  });
}

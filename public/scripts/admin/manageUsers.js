import { addUser } from './adminUsers/addUsers.js';
import { deleteUser } from './adminUsers/deleteUsers.js';
import { getUsers } from './adminUsers/getUsers.js';
import { updateUser } from './adminUsers/updateUsers.js';

document.addEventListener('DOMContentLoaded', function () {
  const getUsersContainer = document.getElementById('getUsersContainer');
  const newUserContainer = document.getElementById('newUserContainer');
  const updateUserContainer = document.getElementById('updateUserContainer');
  const deleteUserContainer = document.getElementById('deleteUserContainer');

  document.getElementById('showGetUsers').addEventListener('click', function () {
    getUsersContainer.style.display = 'block';
    newUserContainer.style.display = 'none';
    updateUserContainer.style.display = 'none';
    deleteUserContainer.style.display = 'none';

    getUsers();
  });

  document.getElementById('showNewUser').addEventListener('click', function () {
    getUsersContainer.style.display = 'none';
    newUserContainer.style.display = 'block';
    updateUserContainer.style.display = 'none';
    deleteUserContainer.style.display = 'none';

    addUser();
  });

  document.getElementById('showUpdateUser').addEventListener('click', function () {
    getUsersContainer.style.display = 'none';
    newUserContainer.style.display = 'none';
    updateUserContainer.style.display = 'block';
    deleteUserContainer.style.display = 'none';

    updateUser();
  });

  document.getElementById('showDeleteUser').addEventListener('click', function () {
    getUsersContainer.style.display = 'none';
    newUserContainer.style.display = 'none';
    updateUserContainer.style.display = 'none';
    deleteUserContainer.style.display = 'block';

    deleteUser();
  });
});

import { userSchema } from './userSchema.js';
import { loadUsers } from './getUsers.js';

export function updateUser() {
  document.getElementById('getUserForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const _id = document.getElementById('_id').value;
    const response = await fetch(`/users/${_id}`);
    if (!response.ok) {
      alert('User not found');
      return;
    }
    const data = await response.json();
    console.log('Fetched User Data:', data);
    console.log('Data Length:', data.length);
    if (data && Object.keys(data).length > 0) {
      generateUpdateUserForm(data);
    } else {
      alert('No user found');
    }
  });

  function generateUpdateUserForm(data) {
    const form = document.getElementById('updateUserForm');
    form.innerHTML = '';

    const idInput = document.createElement('input');
    idInput.type = 'hidden';
    idInput.id = '_id';
    idInput.name = '_id';
    idInput.value = data._id;
    form.appendChild(idInput);

    userSchema.forEach((field) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add(`field-${field.id}`);

      const label = document.createElement('label');
      label.setAttribute('for', field.id);
      label.textContent = field.label;
      wrapper.appendChild(label);

      let input;
      if (field.type === 'checkbox') {
        input = document.createElement('input');
        input.classList.add(`input-${field.type}`);
        input.type = field.type;
        input.id = field.id;
        input.name = field.id;
        input.checked = data[field.id];
      } else {
        input = document.createElement('input');
        input.classList.add('input-newUser');
        input.type = field.type;
        input.id = field.id;
        input.name = field.id;
        if (field.required) input.required = true;
        if (field.placeholder) input.placeholder = field.placeholder;
        if (field.min !== undefined) input.min = field.min;
        if (field.max !== undefined) input.max = field.max;
        if (field.step !== undefined) input.step = field.step;
        input.value = data[field.id] || '';
      }
      wrapper.appendChild(input);
      form.appendChild(wrapper);
      form.appendChild(document.createElement('br'));
    });

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Update User';
    form.appendChild(submitButton);

    document.getElementById('updateUserFormContainer').style.display = 'block';
  }

  document.getElementById('updateUserForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const updateUserData = {};
    formData.forEach((value, key) => {
      if (key === 'isAdmin') {
        updateUserData[key] = value === 'on';
      } else {
        updateUserData[key] = value;
      }
    });

    if (!formData.has('isAdmin')) {
      updateUserData.isAdmin = false;
    }

    const _id = updateUserData._id;
    delete updateUserData['_id'];
    const response = await fetch(`/users/update/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateUserData)
    });
    loadUsers();

    const updateUserMessageDiv = document.getElementById('updateUserMessage');
    if (response.ok) {
      const message = await response.text();
      updateUserMessageDiv.textContent = message;
    } else {
      const errorMessage = await response.text();
      updateUserMessageDiv.textContent = errorMessage;
    }
  });
}

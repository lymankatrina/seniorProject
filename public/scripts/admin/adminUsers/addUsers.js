import { userSchema } from './userSchema.js';
import { loadUsers } from './getUsers.js';

export function addUser() {
  const form = document.getElementById('newUserForm');
  form.innerHTML = '';

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
    }

    wrapper.appendChild(input);
    form.appendChild(wrapper);
    form.appendChild(document.createElement('br'));
  });

  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.value = 'Create New User';
  form.appendChild(submitButton);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const newUserData = {};
    formData.forEach((value, key) => {
      if (key === 'isAdmin') {
        newUserData[key] = value === 'on';
      } else {
        newUserData[key] = value;
      }
    });

    if (!formData.has('isAdmin')) {
      newUserData.isAdmin = false;
    }

    fetch('/users/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUserData)
    })
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('newUserMessage').textContent = data;
        loadUsers();
      })
      .catch((error) => {
        document.getElementById('newUserMessage').textContent = 'Error creating new user';
        console.error('Error:', error);
      });
  });
}

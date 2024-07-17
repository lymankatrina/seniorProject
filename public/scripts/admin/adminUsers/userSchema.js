export const userSchema = [
  { id: 'firstName', label: 'First Name', type: 'text', required: true },
  { id: 'lastName', label: 'Last Name', type: 'text', required: true },
  { id: 'userName', label: 'User Name', type: 'text', required: true },
  { id: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '888-555-1234' },
  { id: 'email', label: 'Email', type: 'email', required: true, placeholder: 'user123@gmail.com' },
  { id: 'isAdmin', label: 'Is Admin', type: 'checkbox', required: true }
];

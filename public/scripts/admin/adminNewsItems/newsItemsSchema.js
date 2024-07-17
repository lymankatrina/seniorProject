export const newsItemsSchema = [
  { id: 'title', label: 'Title', type: 'text', required: true },
  { id: 'tagline', label: 'Tagline', type: 'text', required: true },
  { id: 'description', label: 'Description', type: 'textarea', required: true },
  { id: 'date', label: 'Date', type: 'date', required: true },
  { id: 'image', label: 'Image URL', type: 'url', required: true },
  { id: 'link', label: 'Link URL', type: 'url', required: true },
  {
    id: 'status',
    label: 'Status',
    type: 'radio',
    options: ['Public', 'Private'],
    required: true
  },
  { id: 'isActive', label: 'Is Active', type: 'checkbox' }
];

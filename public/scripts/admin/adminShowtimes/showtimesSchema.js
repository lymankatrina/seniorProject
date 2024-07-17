export const showtimeSchema = [
  { id: 'movieId', label: 'Movie ID', type: 'text', required: true },
  { id: 'startDate', label: 'Start Date', type: 'date', required: true },
  { id: 'endDate', label: 'End Date', type: 'date', required: true },
  { id: 'time', label: 'Time', type: 'text', required: true, placeholder: 'hh:mm AM/PM' },
  { id: 'type', label: 'Type', type: 'text', required: true, placeholder: 'Premier, Matinee, Standard, Special, etc.' },
  { id: 'ticketsAvailable', label: 'Tickets Available', type: 'number', required: true }
];

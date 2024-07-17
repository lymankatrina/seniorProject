export function deleteShowtime() {
  document.getElementById('deleteShowtimeForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const showtimeId = document.getElementById('deleteShowtimeId').value;

    fetch(`http://localhost:8080/showtimes/delete/${showtimeId}`, {
      method: 'DELETE'
    })
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('deleteShowtimeMessage').textContent = data;
      })
      .catch((error) => {
        document.getElementById('deleteShowtimeMessage').textContent = 'Error deleting showtime';
        console.error('Error:', error);
      });
  });
}

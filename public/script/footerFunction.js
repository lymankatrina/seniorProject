const options = { year: 'numeric' };
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
  currentYearElement.textContent = new Date().toLocaleDateString('en-US', options);
}
const updateDateElement = document.getElementById('updateDate');
if (updateDateElement) {
  updateDateElement.textContent = document.lastModified;
}

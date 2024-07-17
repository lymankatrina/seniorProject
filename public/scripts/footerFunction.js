fetch('/partials/footer.html')
  .then((response) => response.text())
  .then((data) => {
    document.getElementById('footer-placeholder').innerHTML = data;

    const options = { year: 'numeric' };
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
      currentYearElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
    const updateDateElement = document.getElementById('updateDate');
    if (updateDateElement) {
      updateDateElement.textContent = document.lastModified;
    }
  })
  .catch((error) => console.error('Error loading header:', error));

let headerHtml;

fetch('/partials/adminHeader.html')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch header HTML');
    }
    return response.text();
  })
  .then((fetchedHeaderHtml) => {
    headerHtml = fetchedHeaderHtml;
    return fetch('http://localhost:8080/profile', {
      credentials: 'include'
    });
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return response.json();
  })
  .then((user) => {
    const userName = user.userProfile.given_name || 'User';
    const modifiedHeaderHtml = headerHtml.replace('{{userName}}', userName);
    document.getElementById('header-placeholder').innerHTML = modifiedHeaderHtml;
  })
  .catch((error) => {
    console.error('Error:', error);
  });

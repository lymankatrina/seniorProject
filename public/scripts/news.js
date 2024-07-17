async function fetchUserAdminStatus() {
  try {
    const response = await fetch('/users/check-admin');
    if (!response.ok) {
      if (response.status === 401) {
        console.warn('User not authenticated');
        return { isAdmin: false, userName: 'Guest' };
      }
      throw new Error('Failed to fetch user admin status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user admin status:', error);
    return { isAdmin: false, userName: 'Guest' };
  }
}

async function fetchPublicNews() {
  try {
    const response = await fetch('/news/public');
    if (!response.ok) {
      throw new Error('Failed to fetch public news');
    }
    const publicNews = await response.json();
    displayPublicNews(publicNews);
  } catch (error) {
    console.error('Error fetching public news:', error);
  }
}

function displayPublicNews(publicNews) {
  const publicNewsContainer = document.getElementById('publicNewsContainer');
  publicNewsContainer.innerHTML = '';

  publicNews.forEach((publicNewsItem) => {
    const publicNewsElement = document.createElement('div');
    publicNewsElement.classList.add('public-news-item-banner');

    publicNewsElement.innerHTML = `
    <div class="news-content">
      <div class="news-image-container">
        <img class="news-image" src="${publicNewsItem.image}" alt="${publicNewsItem.title}" />
      </div>
      <div class="news-details">
        <div class="news-header">
          <h3 class="news-title">${publicNewsItem.title}</h3>
          <h4 class="news-tagline">${publicNewsItem.tagline}</h4>
        </div>
        <div class="news-body">
          <p class="news-description">${publicNewsItem.description}</p>
          <p class="news-date"><strong>Date:</strong> ${new Date(publicNewsItem.date).toLocaleDateString()}</p>
        </div>
        <div class="news-footer">
          <p class="news-read-more"><a href="${publicNewsItem.link}" target="_blank">More Details</a></p>
        </div>
      </div>
    </div>
    `;

    publicNewsContainer.appendChild(publicNewsElement);
  });
}

async function fetchAdminNews() {
  try {
    const response = await fetch('/news/current');
    if (!response.ok) {
      throw new Error('Failed to fetch current news');
    }
    const adminNews = await response.json();
    displayAdminNews(adminNews);
  } catch (error) {
    console.error('Error fetching current news:', error);
  }
}

function displayAdminNews(adminNews) {
  const adminNewsContainer = document.getElementById('adminNewsContainer');
  adminNewsContainer.innerHTML = '';

  adminNews.forEach((adminNewsItem) => {
    const adminNewsElement = document.createElement('div');
    adminNewsElement.classList.add('admin-news-item-banner');

    adminNewsElement.innerHTML = `
    <div class="news-content">
      <div class="news-image-container">
        <img class="news-image" src="${adminNewsItem.image}" alt="${adminNewsItem.title}" />
      </div>
      <div class="news-details">
        <div class="news-header">
          <h3 class="news-title">${adminNewsItem.title}</h3>
          <h4 class="news-tagline">${adminNewsItem.tagline}</h4>
        </div>
        <div class="news-body">
          <p class="news-description">${adminNewsItem.description}</p>
          <p class="news-date"><strong>Date:</strong> ${new Date(adminNewsItem.date).toLocaleDateString()}</p>
        </div>
        <div class="news-footer">
          <p class="news-read-more"><a href="${adminNewsItem.link}" target="_blank">More Details</a></p>
        </div>
      </div>
    </div>
    `;

    adminNewsContainer.appendChild(adminNewsElement);
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  const { isAdmin } = await fetchUserAdminStatus();
  fetchPublicNews();
  if (isAdmin) {
    fetchAdminNews();
  } else {
    document.getElementById('adminNewsContainer').style.display = 'none';
  }
});

export { fetchPublicNews, displayPublicNews, fetchAdminNews, displayAdminNews };

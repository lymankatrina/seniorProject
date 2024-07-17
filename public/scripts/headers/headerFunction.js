async function fetchUserAdminStatus() {
  try {
    const response = await fetch('/users/check-admin');
    if (!response.ok) {
      throw new Error('Failed to fetch user admin status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user admin status:', error);
    return null;
  }
}

async function fetchHeader(headerUrl) {
  try {
    const response = await fetch(headerUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch header');
    }
    const headerHtml = await response.text();
    return headerHtml;
  } catch (error) {
    console.error('Error loading header:', error);
    throw error;
  }
}

async function fetchUserProfile() {
  try {
    const response = await fetch('/profile', { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

async function renderHeader() {
  try {
    const adminStatusResponse = await fetchUserAdminStatus();
    let headerUrl;

  if (!adminStatusResponse) {
    headerUrl = '/pages/partials/header.html';
  } else if (adminStatusResponse.isAdmin) {
    headerUrl = '/pages/partials/adminHeader.html';
  } else {
    headerUrl = '/pages/partials/loggedInHeader.html';
  }

  const [headerHtml, user] = await Promise.all([fetchHeader(headerUrl), fetchUserProfile()]);
  const userName = user.userProfile.given_name || 'User';
  const modifiedHeaderHtml = headerHtml.replace('{{userName}}', userName);
  
  document.getElementById('header-placeholder').innerHTML = modifiedHeaderHtml;
    setActiveNavLink();
  } catch (error) {
    console.error('Error rendering header:', error);
  }
}

function setActiveNavLink() {
  const path = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (href !== '/' && path.startsWith(href))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', renderHeader);

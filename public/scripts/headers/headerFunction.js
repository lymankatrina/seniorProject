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

async function renderHeader() {
  try {
    const { isAdmin, userName } = await fetchUserAdminStatus();
    let headerUrl;

  if (isAdmin) {
    headerUrl = '/pages/partials/adminHeader.html';
  } else if (userName !== 'Guest') {
    headerUrl = '/pages/partials/loggedInHeader.html';
  } else {
    headerUrl = '/pages/partials/header.html';
  }

  const headerHtml = await fetchHeader(headerUrl);
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

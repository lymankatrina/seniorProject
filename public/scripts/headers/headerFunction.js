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

async function fecthHeader(headerUrl) {
  try {
    const response = await fetch(headerUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch header');
    }
    const data = await response.text();
    document.getElementById('header-placeholder').innerHTML = data;
    setActiveNavLink();
  } catch (error) {
    console.error('Error loading header:', error);
  }
}

async function renderHeader() {
  const adminStatusResponse = await fetchUserAdminStatus();

  if (!adminStatusResponse) {
    fecthHeader('/pages/partials/header.html');
  } else if (adminStatusResponse.isAdmin) {
    fecthHeader('/pages/partials/adminHeader.html');
  } else {
    fecthHeader('/pages/partials/loggedInHeader.html');
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

// navbar.js - Handles hamburger menu toggle for mobile nav

document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('active');
    navToggle.setAttribute(
      'aria-label',
      navLinks.classList.contains('active') ? 'Close navigation menu' : 'Open navigation menu'
    );
  });

  // Optional: Close menu when a link is clicked (mobile UX)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
      }
    });
  });
});

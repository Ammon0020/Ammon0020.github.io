/* ═══════════════════════════════════════════════════════════
   AMMON RICHARDS — PORTFOLIO SCRIPT
   Boot sequence, typewriter, tagline cycle, scroll reveals
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── CONFIG ───
  const NAME = 'AMMON RICHARDS';
  const TAGLINES = [
    '3D Designer',
    'Photographer',
    'Hardware Builder',
    'IT Architect',
    'Maker'
  ];
  const TYPE_SPEED = 55;       // ms per character
  const DELETE_SPEED = 35;     // ms per character delete
  const PAUSE_BEFORE_DELETE = 2200;
  const PAUSE_BEFORE_TYPE = 500;

  // ─── ELEMENTS ───
  const bootLines   = document.querySelectorAll('.boot-line');
  const heroMain    = document.getElementById('hero-main');
  const heroName    = document.getElementById('hero-name');
  const heroTagline = document.getElementById('hero-tagline');
  const navToggle   = document.getElementById('nav-toggle');
  const navLinks    = document.getElementById('nav-links');
  const navAnchors  = document.querySelectorAll('.nav-links li a');

  // ─── BOOT SEQUENCE ───
  function runBootSequence() {
    bootLines.forEach((line) => {
      const delay = parseInt(line.dataset.delay, 10) || 0;
      setTimeout(() => {
        line.classList.add('visible');
      }, delay);
    });

    // After boot, show main hero
    const lastDelay = Math.max(
      ...Array.from(bootLines).map(l => parseInt(l.dataset.delay, 10) || 0)
    );
    setTimeout(() => {
      heroMain.classList.add('visible');
      typeText(heroName, NAME, TYPE_SPEED, () => {
        startTaglineCycle();
      });
    }, lastDelay + 800);
  }

  // ─── TYPEWRITER ───
  function typeText(element, text, speed, callback) {
    let i = 0;
    element.textContent = '';
    function tick() {
      if (i < text.length) {
        element.textContent += text[i];
        i++;
        setTimeout(tick, speed);
      } else if (callback) {
        callback();
      }
    }
    tick();
  }

  function deleteText(element, speed, callback) {
    function tick() {
      const text = element.textContent;
      if (text.length > 0) {
        element.textContent = text.slice(0, -1);
        setTimeout(tick, speed);
      } else if (callback) {
        callback();
      }
    }
    tick();
  }

  // ─── TAGLINE CYCLE ───
  let taglineIndex = 0;

  function startTaglineCycle() {
    typeTagline();
  }

  function typeTagline() {
    const text = TAGLINES[taglineIndex];
    typeText(heroTagline, text, TYPE_SPEED, () => {
      setTimeout(() => {
        deleteText(heroTagline, DELETE_SPEED, () => {
          taglineIndex = (taglineIndex + 1) % TAGLINES.length;
          setTimeout(typeTagline, PAUSE_BEFORE_TYPE);
        });
      }, PAUSE_BEFORE_DELETE);
    });
  }

  // ─── MOBILE NAV TOGGLE ───
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile nav on link click
  navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ─── SCROLL REVEAL ───
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger children if they exist
          const children = entry.target.querySelectorAll('.reveal');
          if (children.length > 0) {
            children.forEach((child, i) => {
              setTimeout(() => {
                child.classList.add('visible');
              }, i * 120);
            });
          }
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // ─── ACTIVE NAV LINK ON SCROLL ───
  const sections = document.querySelectorAll('.section, .hero');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach((a) => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + id) {
              a.classList.add('active');
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-56px 0px 0px 0px'
    }
  );

  sections.forEach((section) => {
    navObserver.observe(section);
  });

  // ─── NAV BACKGROUND ON SCROLL ───
  const nav = document.getElementById('nav');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      nav.style.borderBottomColor = 'rgba(57, 255, 20, 0.1)';
    } else {
      nav.style.borderBottomColor = '';
    }
    lastScrollY = scrollY;
  }, { passive: true });

  // ─── INIT ───
  window.addEventListener('DOMContentLoaded', () => {
    runBootSequence();
  });

})();

/* ═══════════════════════════════════════════════════════════
   AMMON RICHARDS — PORTFOLIO SCRIPT
   Boot sequence, typewriter, tagline cycle, scroll reveals,
   interactive expand-on-click for all sections
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── CONFIG ───
  const NAME = 'AMMON RICHARDS';
  const TAGLINES = [
    'IT Professional',
    '3D Print Designer',
    'Photographer',
    'Hardware Builder',
    'Computer Repair Tech',
    'Maker'
  ];
  const TYPE_SPEED = 55;       // ms per character
  const DELETE_SPEED = 35;     // ms per character delete
  const PAUSE_BEFORE_DELETE = 2200;
  const PAUSE_BEFORE_TYPE = 500;

  // ─── DYNAMIC DATA RENDERING ───
  const projContainer = document.getElementById('projects-grid-container');
  if (projContainer && window.siteData && window.siteData.projects) {
    const isHomePage = document.getElementById('hero') !== null;
    let projectsHtml = '';
    
    // Filter projects for home page
    const projectsToRender = isHomePage 
      ? window.siteData.projects.filter(p => p.showOnHome)
      : window.siteData.projects;

    projectsToRender.forEach(p => {
      const imgHtml = p.image ? `<img src="${p.image}" alt="${p.title}" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0.6; mix-blend-mode:luminosity;">` : `<span>${p.placeholder}</span>`;
      
      projectsHtml += `
        <article class="project-card reveal" data-category="${p.category}">
          <div class="project-img">
            <div class="project-img-placeholder">
              ${imgHtml}
            </div>
          </div>
          <div class="project-info">
            <span class="project-tag">${p.category}</span>
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${p.summary}</p>
          </div>
          <div class="project-meta">
            <span>FILE://${p.id}</span>
            <span>STATUS: ${p.status}</span>
          </div>
          <div class="project-detail">
            <button class="project-detail-close" aria-label="Close detail">✕</button>
            <div class="project-detail-inner markdown-body" data-content-file="${p.contentFile}">
              <div style="padding: 2rem; color: var(--color-accent); font-family: var(--font-mono); font-size: 0.9rem; text-align: center;">&gt; INITIATING FILE TRANSFER...</div>
            </div>
          </div>
        </article>
      `;
    });
    
    // Add "View All" button on home page
    if (isHomePage) {
       projectsHtml += `
        <a href="projects.html" class="view-all-tile reveal">
          <span class="view-all-icon">◈</span>
          <span class="view-all-label">&gt; ACCESS ALL PROJECTS_</span>
          <span class="view-all-count">${window.siteData.projects.length} FILES INDEXED</span>
        </a>
       `;
    }
    
    projContainer.innerHTML = projectsHtml;
  }

  const galContainer = document.getElementById('gallery-grid-container');
  if (galContainer && window.siteData && window.siteData.gallery) {
    const isHomePage = document.getElementById('hero') !== null;
    let galleryHtml = '';
    
    const galleryToRender = isHomePage 
      ? window.siteData.gallery.slice(0, 8) // Limit to 8 on home
      : window.siteData.gallery;

    galleryToRender.forEach(g => {
      const imgHtml = g.image ? `<img src="${g.image}" alt="Gallery photo" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; filter:grayscale(100%);">` : `<span>${g.placeholder}</span>`;
      
      galleryHtml += `
        <div class="gallery-item reveal" tabindex="0" data-caption="${g.caption}">
          <div class="gallery-placeholder">
            ${imgHtml}
          </div>
          <div class="gallery-caption-overlay">
            <span class="gallery-caption-text">${g.caption}</span>
          </div>
        </div>
      `;
    });
    
    if (isHomePage) {
       galleryHtml += `
        <a href="gallery.html" class="view-all-tile view-all-tile--gallery reveal">
          <span class="view-all-icon">◈</span>
          <span class="view-all-label">&gt; ACCESS FULL ARCHIVE_</span>
          <span class="view-all-count">${window.siteData.gallery.length} PHOTOS INDEXED</span>
        </a>
       `;
    }
    
    galContainer.innerHTML = galleryHtml;
  }

  // ─── ELEMENTS ───
  const bootLines = document.querySelectorAll('.boot-line');
  const heroMain = document.getElementById('hero-main');
  const heroName = document.getElementById('hero-name');
  const heroTagline = document.getElementById('hero-tagline');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navAnchors = document.querySelectorAll('.nav-links li a');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  // ─── BOOT SEQUENCE ───
  function runBootSequence() {
    if (!heroMain || !heroName || bootLines.length === 0) return;

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

  // ─── PROJECT EXPAND-ON-CLICK ───
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    // Click on card header area (img, info, meta) to expand
    const clickTargets = card.querySelectorAll('.project-img, .project-info, .project-meta');
    clickTargets.forEach((target) => {
      target.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleProjectCard(card);
      });
    });

    // Close button
    const closeBtn = card.querySelector('.project-detail-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.remove('expanded');
      });
    }
  });

  function toggleProjectCard(card) {
    const isExpanded = card.classList.contains('expanded');

    // Close all other expanded cards
    projectCards.forEach((c) => c.classList.remove('expanded'));

    if (!isExpanded) {
      card.classList.add('expanded');
      
      // Load Markdown dynamically
      const detailInner = card.querySelector('.project-detail-inner');
      if (detailInner && detailInner.dataset.contentFile && !detailInner.dataset.loaded) {
        const fileUrl = detailInner.dataset.contentFile;
        fetch(fileUrl)
          .then(res => {
            if (!res.ok) throw new Error('File not found');
            return res.text();
          })
          .then(text => {
            if (window.marked) {
              detailInner.innerHTML = window.marked.parse(text);
            } else {
              detailInner.innerHTML = '<pre style="white-space: pre-wrap;">' + text + '</pre>';
            }
            detailInner.dataset.loaded = 'true';
          })
          .catch(err => {
            detailInner.innerHTML = '<div style="color:var(--color-accent); padding:2rem; font-family:var(--font-mono);">&gt; ERROR: FILE CORRUPTED OR MISSING. ' + err.message + '</div>';
          });
      }

      // Scroll to card smoothly
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  // ─── CAPABILITY TAG DESCRIPTIONS ───
  const capTags = document.querySelectorAll('.cap-tag[data-desc]');
  let activeCapDesc = null;

  capTags.forEach((tag) => {
    tag.addEventListener('click', (e) => {
      e.stopPropagation();

      const readout = tag.closest('.cap-readout');
      if (!readout) return;

      // If this tag already has an active description, close it
      if (tag.classList.contains('active')) {
        closeActiveCapDesc();
        return;
      }

      // Close any existing description
      closeActiveCapDesc();

      // Mark tag as active
      tag.classList.add('active');

      // Create description element
      const desc = document.createElement('div');
      desc.className = 'cap-tag-desc';
      desc.textContent = tag.dataset.desc;

      // Insert after the readout container (so it appears below the row)
      readout.appendChild(desc);

      // Trigger animation on next frame
      requestAnimationFrame(() => {
        desc.classList.add('visible');
      });

      activeCapDesc = { tag, desc };
    });
  });

  function closeActiveCapDesc() {
    if (activeCapDesc) {
      activeCapDesc.tag.classList.remove('active');
      activeCapDesc.desc.classList.remove('visible');
      const descEl = activeCapDesc.desc;
      // Remove after transition
      setTimeout(() => {
        if (descEl.parentNode) {
          descEl.parentNode.removeChild(descEl);
        }
      }, 400);
      activeCapDesc = null;
    }
  }

  // Close cap description when clicking outside
  document.addEventListener('click', (e) => {
    if (activeCapDesc && !e.target.closest('.cap-tag') && !e.target.closest('.cap-tag-desc')) {
      closeActiveCapDesc();
    }
  });

  // ─── WORK HISTORY TICKER CLICK ───
  const tickerItems = document.querySelectorAll('.ticker-item');
  const tickerTrack = document.querySelector('.ticker-track');
  const workPanel = document.getElementById('work-detail-panel');
  const workClose = document.getElementById('work-detail-close');
  const workCompany = document.getElementById('work-detail-company');
  const workRole = document.getElementById('work-detail-role');
  const workDates = document.getElementById('work-detail-dates');
  const workDesc = document.getElementById('work-detail-desc');

  tickerItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();

      // Pause the ticker
      if (tickerTrack) tickerTrack.classList.add('paused');

      // Highlight clicked item
      tickerItems.forEach(ti => ti.classList.remove('active'));
      item.classList.add('active');

      // Populate the panel
      workCompany.textContent = item.textContent;
      workRole.textContent = item.dataset.role || '';
      workDates.textContent = item.dataset.dates || '';
      workDesc.textContent = item.dataset.description || '';

      // Show panel
      workPanel.classList.add('active');

      // Scroll to panel
      setTimeout(() => {
        workPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    });
  });

  function closeWorkPanel() {
    workPanel.classList.remove('active');
    tickerItems.forEach(ti => ti.classList.remove('active'));
    if (tickerTrack) tickerTrack.classList.remove('paused');
  }

  if (workClose) {
    workClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeWorkPanel();
    });
  }

  // ─── GALLERY CAPTION OVERLAY ───
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      // If this item has a real image and is not showing caption, open lightbox
      const img = item.querySelector('img');
      const hasCaption = item.dataset.caption;

      if (hasCaption) {
        // Toggle caption overlay
        const wasCaptioned = item.classList.contains('captioned');

        // Close all other captions
        galleryItems.forEach(gi => gi.classList.remove('captioned'));

        if (!wasCaptioned) {
          item.classList.add('captioned');
        }
      } else if (img) {
        // Open lightbox for real images without caption
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Gallery photo';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // ─── LIGHTBOX ───
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      }
      // Also close gallery captions on Escape
      galleryItems.forEach(gi => gi.classList.remove('captioned'));
      // Close work panel on Escape
      if (workPanel && workPanel.classList.contains('active')) {
        closeWorkPanel();
      }
      // Close active cap desc on Escape
      closeActiveCapDesc();
      // Close expanded project cards on Escape
      projectCards.forEach(c => c.classList.remove('expanded'));
    }
  });

  // ─── CONTACT FORM TOGGLE ───
  const messageMeBtn = document.getElementById('message-me-btn');
  const contactFormPanel = document.getElementById('contact-form-panel');

  if (messageMeBtn && contactFormPanel) {
    messageMeBtn.addEventListener('click', () => {
      contactFormPanel.classList.toggle('active');
      if (contactFormPanel.classList.contains('active')) {
        setTimeout(() => {
          contactFormPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  }

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

  // ─── SCROLL PROGRESS INDICATOR ───
  const scrollProgress = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Nav border glow
    if (scrollY > 100) {
      nav.style.borderBottomColor = 'rgba(57, 255, 20, 0.1)';
    } else {
      nav.style.borderBottomColor = '';
    }
    lastScrollY = scrollY;

    // Update scroll progress bar
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = pct + '%';
    }
  }, { passive: true });

  // ─── AMBIENT PARTICLE LAYER ───
  const particleCanvas = document.getElementById('particles');
  if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    const particles = [];
    const PARTICLE_COUNT = 40;

    function resizeCanvas() {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1
      };
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      const w = particleCanvas.width;
      const h = particleCanvas.height;

      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        // Wrap around edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const rgb = isLight ? '212, 163, 115' : '57, 255, 20';
        ctx.fillStyle = 'rgba(' + rgb + ', ' + p.opacity + ')';
        ctx.fill();
      });

      requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    initParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
    });
  }

  // ─── DARK/LIGHT MODE TOGGLE ───
  const themeToggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'light' ? '☾' : '☀';
    }
  }

  // Initialize theme on load (if not already set by head script)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  // Sync theme across multiple tabs/windows in real-time
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      applyTheme(e.newValue || 'dark');
    }
  });

  // ─── PROJECT FILTER TABS ───
  const filterBtns = document.querySelectorAll('.filter-btn');
  const allProjectCards = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      allProjectCards.forEach((card) => {
        if (filter === 'ALL' || card.dataset.category === filter) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
          card.classList.remove('expanded');
        }
      });
    });
  });

  // ─── SKILLS PROFICIENCY READOUT ANIMATION ───
  const skillsReadout = document.getElementById('skills-readout');
  if (skillsReadout) {
    let skillsAnimated = false;
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !skillsAnimated) {
            skillsAnimated = true;
            const rows = skillsReadout.querySelectorAll('.skill-row');
            rows.forEach((row, i) => {
              const target = parseInt(row.dataset.percent, 10) || 0;
              const fill = row.querySelector('.skill-fill');
              const pct = row.querySelector('.skill-pct');

              setTimeout(() => {
                if (fill) fill.style.width = target + '%';

                // Animate the percentage number
                let current = 0;
                const step = Math.ceil(target / 30);
                const interval = setInterval(() => {
                  current += step;
                  if (current >= target) {
                    current = target;
                    clearInterval(interval);
                  }
                  if (pct) pct.textContent = current + '%';
                }, 40);
              }, i * 200);
            });
            skillsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    skillsObserver.observe(skillsReadout);

    // Add click listeners to skill rows
    const skillRows = skillsReadout.querySelectorAll('.skill-row');
    skillRows.forEach(row => {
      row.addEventListener('click', () => {
        const item = row.closest('.skill-item');
        if (!item) return;
        const isExpanded = item.classList.contains('expanded');
        
        // Close all other items
        skillsReadout.querySelectorAll('.skill-item').forEach(i => i.classList.remove('expanded'));
        skillsReadout.querySelectorAll('.skill-row').forEach(r => r.classList.remove('expanded'));
        
        if (!isExpanded) {
          item.classList.add('expanded');
          row.classList.add('expanded');
        }
      });
    });
  }
  // ─── HIRE FORM TOGGLE ───
  const lvlUpBtn = document.getElementById('lvl-up-btn');
  const hireFormPanel = document.getElementById('hire-form-panel');

  if (lvlUpBtn && hireFormPanel) {
    lvlUpBtn.addEventListener('click', () => {
      hireFormPanel.classList.toggle('active');
      
      if (hireFormPanel.classList.contains('active')) {
        setTimeout(() => {
          hireFormPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
      }
    });
  }

  // ─── LOCAL FILE THEME SYNC ───
  // Appends the current theme to internal links to ensure smooth transitions
  // when testing locally via file:// protocol where localStorage is isolated.
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link || !link.href) return;
    
    // Check if it's an internal HTML link
    const isInternalHtml = link.href.includes('.html') && 
                           (link.hostname === window.location.hostname || link.protocol === 'file:');
                           
    if (isInternalHtml) {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme) {
        try {
          const url = new URL(link.href, window.location.href);
          url.searchParams.set('theme', currentTheme);
          link.href = url.toString();
        } catch (err) {}
      }
    }
  });

  // ─── INIT ───
  window.addEventListener('DOMContentLoaded', () => {
    runBootSequence();
  });

})();

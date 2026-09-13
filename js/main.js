/* ==========================================================================
   MASTER SCRIPT — MANPREET CHAUDHARY PORTFOLIO
   Scroll Progress • Custom Cursor • Project Modals • Mobile Drawer
   ========================================================================== */

import { PORTFOLIO_DATA } from './data.js';
import { initScrollReveals } from './animations.js';
import { initCursorSpotlight } from './cursor.js';
import { initScrollGlide } from './scroll-glide.js';
import { initHeroCenterpiece } from './hero-centerpiece.js';
import './router.js';
import './contact.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollGlide();
  initScrollProgress();
  initNavbarScrollState();
  initCustomCursor();
  initCursorSpotlight();
  initHeroCenterpiece();
  initMobileDrawer();
  initProjectModals();
  initScrollReveals();
});

// Re-init components on page swap via client-side router
window.addEventListener('page:swapped', () => {
  initProjectModals();
  initNavbarScrollState();
  initCursorSpotlight();
  initHeroCenterpiece();
});

/* --------------------------------------------------------------------------
   1. Scroll Progress Bar
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* --------------------------------------------------------------------------
   2. Navbar Scrolled State
   -------------------------------------------------------------------------- */
function initNavbarScrollState() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   3. Custom Magnetic Cursor (Desktop)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip touch devices

  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  const renderCursor = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderCursor);
  };
  renderCursor();

  // Attach hover expand states to interactive elements
  const attachHoverListeners = () => {
    const interactives = document.querySelectorAll('a, button, .project-card, .cert-card, input, textarea');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  };

  attachHoverListeners();
  window.addEventListener('page:swapped', attachHoverListeners);
}

/* --------------------------------------------------------------------------
   3b. Playable 3D Orbital Object with Momentum Physics & Idle Orbit
   Pure visual toy: Drag, spin, or flick with inertia friction & gentle return
   -------------------------------------------------------------------------- */
function initGyroscopeParallax() {
  const container = document.querySelector('.figure-3d-container');
  if (!container) return;

  const stage = container.querySelector('.figure-3d-stage');
  let rotX = 22;
  let rotY = 0;
  let vx = 0;
  let vy = 0;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let rafId = null;

  // Track pointer down (Mouse & Touch)
  const onPointerDown = (e) => {
    isDragging = true;
    container.classList.add('is-dragging');
    if (stage) stage.classList.remove('is-idle');

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    lastMouseX = clientX;
    lastMouseY = clientY;
    vx = 0;
    vy = 0;
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - lastMouseX;
    const dy = clientY - lastMouseY;

    // Direct angular deflection
    rotY += dx * 0.45;
    rotX -= dy * 0.45;

    // Pitch constraint to keep gimbals visible
    rotX = Math.max(-75, Math.min(75, rotX));

    // Calculate instantaneous velocity for inertia fling
    vx = dx * 0.45;
    vy = -dy * 0.45;

    lastMouseX = clientX;
    lastMouseY = clientY;
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    container.classList.remove('is-dragging');
  };

  container.addEventListener('mousedown', onPointerDown, { passive: true });
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('mouseup', onPointerUp, { passive: true });

  container.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  // Physics animation loop: Handles momentum inertia, friction, and return to idle orbit
  function physicsLoop() {
    if (!isDragging) {
      // Apply momentum velocity with physical damping
      if (Math.hypot(vx, vy) > 0.04) {
        rotY += vx;
        rotX += vy;
        rotX = Math.max(-75, Math.min(75, rotX));

        vx *= 0.93; // Angular friction decay
        vy *= 0.93;
      } else {
        // Momentum settled: gracefully blend into continuous idle orbit rotation
        rotY += 0.28; // Idle spin rate
        rotX += (22 - rotX) * 0.04; // Smooth spring return to resting 22° pitch
      }
    }

    container.style.setProperty('--tilt-x', `${rotX.toFixed(2)}deg`);
    container.style.setProperty('--tilt-y', `${rotY.toFixed(2)}deg`);

    rafId = requestAnimationFrame(physicsLoop);
  }

  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(physicsLoop);
}

/* --------------------------------------------------------------------------
   4. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    const isOpen = drawer.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking any link inside
  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Project Modals
   -------------------------------------------------------------------------- */
function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  if (!modalOverlay) return;

  const modalContainer = modalOverlay.querySelector('.modal-container');
  const closeBtn = modalOverlay.querySelector('.modal-close-btn');
  const modalContent = document.getElementById('modal-dynamic-content');

  const openModal = (projectId) => {
    const project = PORTFOLIO_DATA.projects.find(p => p.id === projectId);
    if (!project || !modalContent) return;

    modalContent.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
        <span class="section-tag" style="margin-bottom: 0;">${project.category}</span>
        ${project.metrics ? `<span class="badge badge-accent font-mono">${project.metrics[0].label}: ${project.metrics[0].value}</span>` : ''}
      </div>
      <h2 style="font-size: 1.85rem; margin-bottom: 0.75rem;">${project.title}</h2>
      <p style="font-size: 1.1rem; color: var(--accent-primary); margin-bottom: 1.5rem; font-weight: 500;">
        ${project.tagline}
      </p>

      <div style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.75rem;">
        <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.6rem;">Engineering & Research Overview</h4>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.65;">
          ${project.fullDescription || project.description}
        </p>
      </div>

      <div style="margin-bottom: 1.75rem;">
        <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.75rem;">Key Architecture Highlights</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem;">
          ${(project.highlights || []).map(h => `
            <li style="position: relative; padding-left: 1.4rem; color: var(--text-secondary); font-size: 0.92rem;">
              <span style="position: absolute; left: 0; color: var(--accent-primary);">▹</span>
              ${h}
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 0.75rem;">
          Technologies & Systems Stack
        </h4>
        <div class="tag-list">
          ${(project.techStack || []).map(tech => `
            <span class="tag-pill">${tech}</span>
          `).join('')}
        </div>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
        ${project.liveUrl && project.liveUrl !== '#' ? `
          <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <span>Visit Live Platform</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        ` : ''}
        ${project.githubUrl ? `
          <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <span>View Architecture / Repository</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        ` : ''}
      </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Card click trigger
  document.querySelectorAll('[data-project-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open modal if clicking direct external link icon
      if (e.target.closest('a')) return;
      const id = card.getAttribute('data-project-id');
      if (id) openModal(id);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

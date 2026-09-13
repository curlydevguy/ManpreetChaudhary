/* ==========================================================================
   BIDIRECTIONAL SCROLL REVEAL & INTERACTION ENGINE
   Repeating Multi-Directional Entry & Exit • GPU-Smooth (Transform & Opacity)
   Card Grid Stagger Wave • Timeline Node Illumination • Reduced Motion Safe
   ========================================================================== */

let scrollObserver = null;
let timelineObserver = null;

export function initScrollReveals() {
  if (typeof window === 'undefined') return;

  // Disconnect previous observers if re-initializing
  if (scrollObserver) {
    scrollObserver.disconnect();
    scrollObserver = null;
  }
  if (timelineObserver) {
    timelineObserver.disconnect();
    timelineObserver = null;
  }

  // Comprehensive selectors targeting all key content blocks across all 7 pages
  const REVEAL_SELECTORS = [
    '.reveal-on-scroll',
    '.reveal-from-left',
    '.reveal-from-right',
    '.reveal-from-bottom',
    '.reveal-from-top',
    '.reveal-scale',
    '.profile-reveal',
    '.section-header',
    '.project-card',
    '.quicklink-card',
    '.timeline-item',
    '.cert-card',
    '.skill-quadrant-card',
    '.skills-domain-card',
    '.pipeline-step-card',
    '.contact-item-card',
    '.contact-form-card',
    '.research-hud-panel',
    '.hero-affiliation-bar',
    '.hero-impact-card',
    '.hero-centerpiece-stage',
    '.glass-card'
  ].join(', ');

  const rawElements = Array.from(document.querySelectorAll(REVEAL_SELECTORS));
  // Filter out any elements inside hidden modals
  const revealElements = rawElements.filter(el => !el.closest('#project-modal'));

  // Ensure every targeted content element has a base reveal class
  revealElements.forEach(el => {
    if (!el.classList.contains('reveal-on-scroll') &&
        !el.classList.contains('reveal-from-left') &&
        !el.classList.contains('reveal-from-right') &&
        !el.classList.contains('reveal-from-bottom') &&
        !el.classList.contains('reveal-from-top') &&
        !el.classList.contains('reveal-scale') &&
        !el.classList.contains('profile-reveal')) {
      el.classList.add('reveal-on-scroll');
    }
  });

  // Subtle cascading stagger delay for cards within structured grid layouts
  const GRID_CONTAINERS = [
    '.quicklinks-grid',
    '.projects-grid',
    '.cert-grid',
    '.skills-quadrant-grid',
    '.skills-domain-grid',
    '.pipeline-grid',
    '.hero-info-cards-row',
    '.hero-impact-grid',
    '.contact-layout',
    '.contact-info-list',
    '.timeline-wrapper',
    '.stagger-container'
  ];

  GRID_CONTAINERS.forEach(containerSelector => {
    document.querySelectorAll(containerSelector).forEach(container => {
      const children = Array.from(container.children).filter(child => {
        return child.matches(REVEAL_SELECTORS) || child.classList.contains('timeline-item');
      });
      children.forEach((child, index) => {
        const staggerDelay = (index % 4) * 65;
        child.style.transitionDelay = `${staggerDelay}ms`;
      });
    });
  });

  // Immediate reveal for above-the-fold content to prevent initial blank flash
  const vh = window.innerHeight;
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh - 40 && rect.bottom > 20) {
      el.classList.add('is-revealed');
    }
  });

  // Repeating Bidirectional IntersectionObserver
  // rootMargin: -50px at bottom ensures reveal starts right as element enters,
  // and exit triggers as user scrolls up away from it while still in view.
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: [0, 0.08]
  };

  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;

      if (entry.isIntersecting) {
        // In viewport: smoothly slide into view (slide up with fade-in)
        el.classList.add('is-revealed');
      } else {
        // Out of viewport:
        // When user scrolls UP, element exits down past bottom threshold (top > 0)
        // Remove .is-revealed so it smoothly slides back out (down) and fades away.
        // It will repeat the smooth entry every time the user scrolls down again!
        if (entry.boundingClientRect.top > 0) {
          el.classList.remove('is-revealed');
        }
      }
    });
  }, observerOptions);

  revealElements.forEach(el => scrollObserver.observe(el));

  // Initialize Timeline Nodes Lighting
  initTimelineScroll();
}

function initTimelineScroll() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (!timelineItems.length) return;

  const timelineOptions = {
    root: null,
    rootMargin: '-10% 0px -30% 0px',
    threshold: 0.18
  };

  timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const node = entry.target.querySelector('.timeline-node');
      if (!node) return;

      if (entry.isIntersecting) {
        node.classList.add('active-node');
      } else if (entry.boundingClientRect.top > window.innerHeight * 0.45) {
        node.classList.remove('active-node');
      }
    });
  }, timelineOptions);

  timelineItems.forEach(item => timelineObserver.observe(item));
}

// Auto-run on DOM ready and router page swaps
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveals);
  } else {
    initScrollReveals();
  }

  window.addEventListener('page:swapped', () => {
    setTimeout(initScrollReveals, 60);
  });
}

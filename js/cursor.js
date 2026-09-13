/* ==========================================================================
   CURSOR SPOTLIGHT & FLASHLIGHT REVEAL MECHANIC
   Reactive Cursor Lighting • Specular Surface Highlights • Mobile Fallback
   ========================================================================== */

let isSpotlightActive = true;
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;
let isMoving = false;
let rafId = null;

export function initCursorSpotlight() {
  if (typeof window === 'undefined') return;

  // Create or retrieve spotlight DOM element
  let spotlight = document.getElementById('cursor-spotlight');
  if (!spotlight) {
    spotlight = document.createElement('div');
    spotlight.id = 'cursor-spotlight';
    spotlight.className = 'cursor-spotlight-layer';
    document.body.appendChild(spotlight);
  }

  // Setup Mouse Tracking
  const isTouch = window.matchMedia('(hover: none)').matches;

  if (!isTouch) {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    startInterpolationLoop();
  } else {
    // Mobile / Touch Fallback: Viewport scroll-driven focal spotlight
    window.addEventListener('scroll', handleTouchScrollReveal, { passive: true });
    handleTouchScrollReveal();
  }

  // Bind Proximity Shine on Interactive Cards
  initCardSpecularShine();

  // Bind Spotlight Toggle Button if present
  initSpotlightToggle();
}

function handleMouseMove(e) {
  targetX = e.clientX;
  targetY = e.clientY;
  isMoving = true;

  // Direct CSS variable updates for cards in immediate vicinity
  document.documentElement.style.setProperty('--mouse-x', `${targetX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${targetY}px`);
}

function handleMouseLeave() {
  isMoving = false;
}

function startInterpolationLoop() {
  function loop() {
    // Smooth lerp interpolation for silky 120fps motion
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;

    const spotlight = document.getElementById('cursor-spotlight');
    if (spotlight && isSpotlightActive) {
      spotlight.style.background = `radial-gradient(
        600px circle at ${currentX}px ${currentY}px,
        rgba(37, 99, 235, 0.07) 0%,
        rgba(37, 99, 235, 0.02) 40%,
        transparent 75%
      )`;
      spotlight.style.opacity = '1';
    }

    rafId = requestAnimationFrame(loop);
  }

  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(loop);
}

function initCardSpecularShine() {
  const cards = document.querySelectorAll(
    '.project-card, .timeline-card, .skills-domain-card, .glass-card, .cert-card, .pipeline-step-card'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--card-x', `${x}px`);
      card.style.setProperty('--card-y', `${y}px`);
    });
  });
}

function handleTouchScrollReveal() {
  const spotlight = document.getElementById('cursor-spotlight');
  if (!spotlight) return;

  const centerY = window.innerHeight * 0.45;
  const centerX = window.innerWidth * 0.5;

  spotlight.style.background = `radial-gradient(
    480px circle at ${centerX}px ${centerY}px,
    rgba(37, 99, 235, 0.06) 0%,
    rgba(37, 99, 235, 0.015) 50%,
    transparent 75%
  )`;
  spotlight.style.opacity = '1';
}

function initSpotlightToggle() {
  const toggleBtn = document.getElementById('spotlight-toggle-btn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    isSpotlightActive = !isSpotlightActive;
    const spotlight = document.getElementById('cursor-spotlight');
    const textElem = toggleBtn.querySelector('.toggle-text');

    if (isSpotlightActive) {
      toggleBtn.classList.remove('spotlight-disabled');
      if (textElem) textElem.textContent = 'Aura Focus: Active';
      if (spotlight) {
        spotlight.style.display = 'block';
        requestAnimationFrame(() => {
          spotlight.style.opacity = '1';
        });
      }
    } else {
      toggleBtn.classList.add('spotlight-disabled');
      if (textElem) textElem.textContent = 'Aura Focus: Paused';
      if (spotlight) {
        spotlight.style.opacity = '0';
        setTimeout(() => {
          if (!isSpotlightActive && spotlight) spotlight.style.display = 'none';
        }, 350);
      }
    }
  });
}

// Auto-run on DOM ready and page swaps
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursorSpotlight);
  } else {
    initCursorSpotlight();
  }
  window.addEventListener('page:swapped', () => {
    setTimeout(initCursorSpotlight, 60);
  });
}

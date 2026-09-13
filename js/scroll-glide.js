/* ==========================================================================
   INERTIAL GLIDING SCROLL ENGINE — SILKY SMOOTH MOMENTUM
   Lerp interpolation for fluid, cinematic page gliding
   ========================================================================== */

let isGliding = false;
let currentY = 0;
let targetY = 0;
let rafId = null;

export function initScrollGlide() {
  if (typeof window === 'undefined') return;

  // Touch devices use native momentum scroll
  if (window.matchMedia('(pointer: coarse)').matches) return;

  currentY = window.scrollY;
  targetY = window.scrollY;

  const getMaxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const lerp = (start, end, factor) => start + (end - start) * factor;

  const updateGlide = () => {
    if (!isGliding) return;

    const maxScroll = getMaxScroll();
    targetY = Math.max(0, Math.min(maxScroll, targetY));

    // 0.082 lerp factor gives a luxurious, responsive gliding momentum
    currentY = lerp(currentY, targetY, 0.082);

    if (Math.abs(targetY - currentY) < 0.4) {
      currentY = targetY;
      window.scrollTo(0, currentY);
      isGliding = false;
      return;
    }

    window.scrollTo(0, currentY);
    rafId = requestAnimationFrame(updateGlide);
  };

  const startGlide = () => {
    if (!isGliding) {
      isGliding = true;
      rafId = requestAnimationFrame(updateGlide);
    }
  };

  // Intercept mouse wheel events for gliding momentum
  window.addEventListener('wheel', (e) => {
    // If a modal or drawer is open and target is inside it, allow standard scroll
    const activeModal = document.querySelector('#project-modal.active, .mobile-nav-drawer.open');
    if (activeModal && activeModal.contains(e.target)) return;

    // Check if cursor is over a nested scrollable element
    let el = e.target;
    let isScrollableChild = false;
    while (el && el !== document.body && el !== document.documentElement) {
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
        isScrollableChild = true;
        break;
      }
      el = el.parentElement;
    }
    if (isScrollableChild) return;

    // Intercept native jumpy step
    e.preventDefault();

    let delta = e.deltaY;
    // Normalize deltaMode (0: pixels, 1: lines, 2: pages)
    if (e.deltaMode === 1) delta *= 34;
    else if (e.deltaMode === 2) delta *= window.innerHeight;

    // Apply gentle velocity scaling
    const maxScroll = getMaxScroll();
    targetY = Math.max(0, Math.min(maxScroll, targetY + delta));
    startGlide();
  }, { passive: false });

  // Keep internal coordinates synced when user uses keyboard, scrollbar, or links
  window.addEventListener('scroll', () => {
    if (!isGliding) {
      currentY = window.scrollY;
      targetY = window.scrollY;
    }
  }, { passive: true });

  // Reset coordinates on client-side route transitions
  window.addEventListener('page:swapped', () => {
    isGliding = false;
    currentY = 0;
    targetY = 0;
    if (rafId) cancelAnimationFrame(rafId);
  });

  // Handle window resizing
  window.addEventListener('resize', () => {
    const maxScroll = getMaxScroll();
    targetY = Math.min(targetY, maxScroll);
    currentY = Math.min(currentY, maxScroll);
  });
}

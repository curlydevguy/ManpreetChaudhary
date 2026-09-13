/* ==========================================================================
   CINEMATIC PAGE TRANSITION ROUTER — SHARED MOTIF
   Fades/slides into darkness • Emerges into light • Seamless History Navigation
   ========================================================================== */

import { initScrollReveals } from './animations.js';

class CinematicRouter {
  constructor() {
    this.contentContainer = null;
    this.isTransitioning = false;
    this.pageCache = new Map();

    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  init() {
    this.contentContainer = document.getElementById('page-content');
    if (!this.contentContainer) return;

    // Cache current page content
    const currentPath = this.normalizePath(window.location.pathname);
    this.pageCache.set(currentPath, {
      title: document.title,
      html: this.contentContainer.innerHTML
    });

    // Intercept navigation clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Ignore external links, anchors, or new tabs
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        link.target === '_blank' ||
        link.hasAttribute('download')
      ) {
        return;
      }

      // If it's a hash jump on the same page
      if (href.startsWith('#')) {
        return;
      }

      e.preventDefault();
      this.navigate(href);
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname, false);
    });

    this.updateActiveNavLinks(window.location.pathname);
  }

  normalizePath(url) {
    let path = url.split('?')[0].split('#')[0];
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    if (path === '' || path === '/') return '/index.html';
    if (!path.includes('.') && !path.endsWith('/')) {
      path = path + '.html';
    }
    return path;
  }

  async navigate(url, pushState = true) {
    if (this.isTransitioning) return;
    const normalizedTarget = this.normalizePath(url);
    const normalizedCurrent = this.normalizePath(window.location.pathname);

    // If navigating to the exact same page, just scroll to top
    if (normalizedTarget === normalizedCurrent && pushState) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.isTransitioning = true;

    // Close mobile menu if open
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileDrawer) mobileDrawer.classList.remove('open');

    // 1. Outgoing transition: Content dissolves into darkness
    this.contentContainer.classList.add('page-fade-out');

    try {
      // 2. Fetch or retrieve cached page
      let pageData = this.pageCache.get(normalizedTarget);
      if (!pageData) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const newContent = doc.getElementById('page-content');

        if (!newContent) throw new Error('Missing #page-content container in target');

        pageData = {
          title: doc.title || 'Manpreet Chaudhary | Portfolio',
          html: newContent.innerHTML
        };
        this.pageCache.set(normalizedTarget, pageData);
      }

      // Wait for exit animation to complete (320ms)
      await new Promise(resolve => setTimeout(resolve, 320));

      // 3. Swap DOM content & Update Title
      this.contentContainer.innerHTML = pageData.html;
      document.title = pageData.title;

      // 4. Update History state if needed
      if (pushState) {
        window.history.pushState(null, '', url);
      }

      // Scroll smoothly to top
      window.scrollTo({ top: 0, behavior: 'instant' });

      // 5. Update Navigation Indicators
      this.updateActiveNavLinks(normalizedTarget);

      // 6. Incoming transition: Content emerges out of darkness
      this.contentContainer.classList.remove('page-fade-out');
      this.contentContainer.classList.add('page-fade-in');

      setTimeout(() => {
        this.contentContainer.classList.remove('page-fade-in');
        this.isTransitioning = false;
      }, 450);

      // 7. Re-initialize scroll animations and components on new DOM
      initScrollReveals();
      window.dispatchEvent(new CustomEvent('page:swapped', { detail: { path: normalizedTarget } }));

    } catch (err) {
      console.warn('Cinematic transition fallback to native navigation:', err);
      // If fetch fails (e.g. file:// protocol restriction), fallback to native navigation
      window.location.href = url;
    }
  }

  updateActiveNavLinks(currentUrl) {
    const norm = this.normalizePath(currentUrl);
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (!linkHref) return;
      const linkNorm = this.normalizePath(linkHref);

      if (linkNorm === norm) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }
}

export const router = new CinematicRouter();

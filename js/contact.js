/* ==========================================================================
   CONTACT FORM & MICRO-INTERACTIONS
   Validation • Loading Spinner • Success Checkmark • Clipboard Micro-action
   ========================================================================== */

export function initContactFeatures() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  // Form Submission Micro-Interaction
  if (form && submitBtn) {
    // Remove previous listeners to prevent duplicate triggers
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    const activeBtn = newForm.querySelector('#submit-btn');

    newForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = newForm.querySelector('#contact-name')?.value.trim();
      const email = newForm.querySelector('#contact-email')?.value.trim();
      const message = newForm.querySelector('#contact-message')?.value.trim();

      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      // Enter loading state
      activeBtn.classList.add('is-loading');
      activeBtn.setAttribute('disabled', 'true');

      // Simulate asynchronous send
      setTimeout(() => {
        activeBtn.classList.remove('is-loading');
        activeBtn.classList.add('is-success');

        // Reset fields
        newForm.reset();

        // Restore normal state after 3.5s
        setTimeout(() => {
          activeBtn.classList.remove('is-success');
          activeBtn.removeAttribute('disabled');
        }, 3500);
      }, 1000);
    });
  }

  // Copy Email to Clipboard
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'manpreetchaudhary@outlook.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Email Copied!</span>
        `;
        copyEmailBtn.classList.add('badge-accent');

        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText;
          copyEmailBtn.classList.remove('badge-accent');
        }, 2200);
      }).catch(err => {
        console.warn('Clipboard write failed:', err);
      });
    });
  }
}

// Auto-run on DOM ready and page swaps
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initContactFeatures);
  window.addEventListener('page:swapped', initContactFeatures);
}

/**
 * Adds a soft radial glow that originates at the pointer on press, giving Apex
 * buttons and pills a tactile feel without a heavy ripple animation.
 *
 * Delegated from the document so it covers markup added later by the theme
 * editor without needing to re-bind.
 */
(function () {
  const SELECTOR = '.apex-btn, .apex-pill';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.addEventListener('pointerdown', (event) => {
    if (reduceMotion.matches) return;

    const button = event.target.closest(SELECTOR);
    if (!button) return;

    const rect = button.getBoundingClientRect();
    button.style.setProperty('--apex-press-x', `${event.clientX - rect.left}px`);
    button.style.setProperty('--apex-press-y', `${event.clientY - rect.top}px`);
    button.classList.add('is-pressed');

    const release = () => {
      button.classList.remove('is-pressed');
      button.removeEventListener('pointerup', release);
      button.removeEventListener('pointercancel', release);
      button.removeEventListener('pointerleave', release);
    };

    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
  });
})();

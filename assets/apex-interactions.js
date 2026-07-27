/**
 * Apex interaction layer: button press glow, cursor glow, and momentum scroll.
 *
 * Everything here is progressive enhancement. If this file fails to load the
 * site still works, the buttons still animate via CSS, and the branded CSS
 * cursor and scrollbar are unaffected.
 */
(function () {
  const config = window.ApexTheme || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  // Shopify's theme editor re-renders sections constantly and manages its own
  // scrolling, so the scroll and cursor effects stay out of its way.
  const inThemeEditor = Boolean(window.Shopify && window.Shopify.designMode);

  /* ------------------------------------------------------------------ *
   * Button press glow
   * ------------------------------------------------------------------ */

  document.addEventListener('pointerdown', (event) => {
    if (reduceMotion.matches) return;

    const button = event.target.closest('.apex-btn, .apex-pill');
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

  /* ------------------------------------------------------------------ *
   * Cursor glow
   *
   * The CSS cursor does the precise work. This adds a soft orange halo that
   * eases in behind it and swells over anything clickable.
   * ------------------------------------------------------------------ */

  function initCursor() {
    if (config.cursor === false) return;
    if (!finePointer.matches || reduceMotion.matches) return;

    document.documentElement.classList.add('apex-cursor');

    const glow = document.createElement('div');
    glow.className = 'apex-cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    const INTERACTIVE = 'a, button, summary, label, select, [role="button"], .apex-btn, .apex-pill';

    let pointerX = 0;
    let pointerY = 0;
    let glowX = 0;
    let glowY = 0;
    let visible = false;
    let frame = null;

    const render = () => {
      // Ease toward the pointer. The lag is what reads as a trail.
      glowX += (pointerX - glowX) * 0.18;
      glowY += (pointerY - glowY) * 0.18;
      glow.style.transform = `translate3d(${glowX.toFixed(2)}px, ${glowY.toFixed(2)}px, 0)`;

      // Stop the loop once the glow has effectively caught up.
      if (Math.abs(pointerX - glowX) < 0.1 && Math.abs(pointerY - glowY) < 0.1) {
        frame = null;
        return;
      }
      frame = requestAnimationFrame(render);
    };

    const wake = () => {
      if (frame === null) frame = requestAnimationFrame(render);
    };

    document.addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType !== 'mouse') return;
        pointerX = event.clientX;
        pointerY = event.clientY;

        if (!visible) {
          visible = true;
          glowX = pointerX;
          glowY = pointerY;
          glow.classList.add('is-visible');
        }

        const target = event.target;
        const overInteractive = target instanceof Element && target.closest(INTERACTIVE);
        glow.classList.toggle('is-active', Boolean(overInteractive));
        wake();
      },
      { passive: true }
    );

    document.addEventListener('pointerdown', () => glow.classList.add('is-active'));
    document.addEventListener('pointerup', () => glow.classList.remove('is-active'));
    document.addEventListener('mouseleave', () => {
      visible = false;
      glow.classList.remove('is-visible');
    });
  }

  /* ------------------------------------------------------------------ *
   * Momentum scroll
   *
   * Wheel input is accumulated into a target position, then chased with an
   * eased loop so scrolling glides to a stop instead of halting dead.
   * Touch is left alone — mobile already has good native inertia.
   * ------------------------------------------------------------------ */

  function initMomentumScroll() {
    if (config.smoothScroll === false) return;
    if (inThemeEditor || !finePointer.matches || reduceMotion.matches) return;

    // 1 (glacial) to 15 (nearly instant). Lower means a longer glide.
    const strength = Math.min(Math.max(Number(config.scrollStrength) || 8, 1), 15);
    const ease = strength / 100;

    let target = window.scrollY;
    let current = window.scrollY;
    let animating = false;
    let hijacking = false;

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const step = () => {
      const distance = target - current;

      if (Math.abs(distance) < 0.4) {
        current = target;
        window.scrollTo(0, current);
        animating = false;
        hijacking = false;
        return;
      }

      current += distance * ease;
      window.scrollTo(0, current);
      requestAnimationFrame(step);
    };

    // Walks up from the event target looking for a pane that scrolls itself,
    // such as the cart drawer or a long select.
    const isInsideScrollable = (node) => {
      let el = node instanceof Element ? node : null;

      while (el && el !== document.body && el !== document.documentElement) {
        const style = getComputedStyle(el);
        const scrolls = /(auto|scroll|overlay)/.test(style.overflowY);
        if (scrolls && el.scrollHeight > el.clientHeight + 1) return true;
        el = el.parentElement;
      }
      return false;
    };

    const resync = () => {
      hijacking = false;
      animating = false;
      current = window.scrollY;
      target = window.scrollY;
    };

    window.addEventListener(
      'wheel',
      (event) => {
        // Leave zoom, horizontal intent, and already-handled events alone.
        if (event.ctrlKey || event.defaultPrevented) return;
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        if (isInsideScrollable(event.target)) return;

        // Page-locked states (open drawer or modal) must not scroll behind.
        if (getComputedStyle(document.body).overflow === 'hidden') return;

        event.preventDefault();

        if (!hijacking) {
          hijacking = true;
          current = window.scrollY;
          target = window.scrollY;
        }

        // Line and page deltas need converting to pixels.
        const factor =
          event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
        target = Math.min(Math.max(target + event.deltaY * factor, 0), maxScroll());

        if (!animating) {
          animating = true;
          requestAnimationFrame(step);
        }
      },
      { passive: false }
    );

    // Anything that scrolls the page by other means — keyboard, scrollbar drag,
    // anchor links, back-to-top — resyncs the loop so it never fights the user.
    ['keydown', 'touchstart', 'mousedown'].forEach((type) =>
      window.addEventListener(type, resync, { passive: true })
    );

    window.addEventListener(
      'scroll',
      () => {
        if (!hijacking) {
          current = window.scrollY;
          target = window.scrollY;
        }
      },
      { passive: true }
    );
  }

  function init() {
    initCursor();
    initMomentumScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

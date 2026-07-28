/**
 * Shared image/video lightbox.
 *
 * Any element that carries data-apex-lightbox opts in. It reads:
 *   data-full     full-size image or video URL
 *   data-caption  title shown under the media
 *   data-category small label above the title (optional)
 *   data-type     "video" to render a <video>, anything else renders an <img>
 *
 * Arrow keys and the on-screen arrows cycle through the other opted-in
 * elements inside the same [data-lightbox-group] container, so a filtered
 * gallery only steps through what is actually on screen.
 */
(function () {
  var lb = null;
  var items = [];
  var index = 0;
  var isOpen = false;
  var lastFocus = null;

  function build() {
    if (lb) return lb;
    lb = document.createElement('div');
    lb.className = 'apex-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<button class="apex-lightbox__btn apex-lightbox__close" aria-label="Close">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="apex-lightbox__btn apex-lightbox__prev" aria-label="Previous">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button class="apex-lightbox__btn apex-lightbox__next" aria-label="Next">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '<p class="apex-lightbox__caption"><em></em><span></span></p>';
    document.body.appendChild(lb);

    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });
    lb.querySelector('.apex-lightbox__close').addEventListener('click', close);
    lb.querySelector('.apex-lightbox__prev').addEventListener('click', function (e) {
      e.stopPropagation();
      step(-1);
    });
    lb.querySelector('.apex-lightbox__next').addEventListener('click', function (e) {
      e.stopPropagation();
      step(1);
    });
    return lb;
  }

  function render() {
    var el = items[index];
    if (!el) return;

    var old = lb.querySelector('.apex-lightbox__media');
    if (old) old.remove();

    var media;
    if (el.getAttribute('data-type') === 'video') {
      media = document.createElement('video');
      media.src = el.getAttribute('data-full');
      media.controls = true;
      media.autoplay = true;
      media.playsInline = true;
      media.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    } else {
      media = document.createElement('img');
      media.src = el.getAttribute('data-full');
      media.alt = el.getAttribute('data-caption') || '';
    }
    media.className = 'apex-lightbox__media';
    lb.insertBefore(media, lb.querySelector('.apex-lightbox__caption'));

    var cat = el.getAttribute('data-category') || '';
    lb.querySelector('.apex-lightbox__caption em').textContent = cat;
    lb.querySelector('.apex-lightbox__caption em').style.display = cat ? '' : 'none';
    lb.querySelector('.apex-lightbox__caption span').textContent = el.getAttribute('data-caption') || '';

    var multi = items.length > 1;
    lb.querySelector('.apex-lightbox__prev').style.display = multi ? '' : 'none';
    lb.querySelector('.apex-lightbox__next').style.display = multi ? '' : 'none';
  }

  function step(dir) {
    if (!items.length) return;
    index = (index + dir + items.length) % items.length;
    render();
  }

  function open(el) {
    build();
    lastFocus = document.activeElement;

    var group = el.closest('[data-lightbox-group]') || document;
    items = Array.prototype.slice
      .call(group.querySelectorAll('[data-apex-lightbox]'))
      .filter(function (n) {
        // Skip anything a filter has hidden, so the arrows match what's visible.
        return n.offsetParent !== null || n === el;
      });
    index = items.indexOf(el);
    if (index < 0) index = 0;

    render();
    // Force a reflow so the open transition has a starting point. rAF would be
    // the usual trick but never fires on a page that isn't compositing, which
    // would leave the overlay invisible while scrolling stayed locked.
    void lb.offsetHeight;
    lb.classList.add('is-open');
    isOpen = true;
    document.documentElement.style.overflow = 'hidden';
    lb.querySelector('.apex-lightbox__close').focus();
  }

  function close() {
    if (!lb) return;
    isOpen = false;
    lb.classList.remove('is-open');
    var v = lb.querySelector('video');
    if (v) {
      v.pause();
      v.removeAttribute('src');
    }
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-apex-lightbox]');
    if (!el) return;
    e.preventDefault();
    open(el);
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
})();

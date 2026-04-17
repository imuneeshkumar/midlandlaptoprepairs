(function () {
  'use strict';

  // ---------- Footer year ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Scroll reveal via IntersectionObserver ----------
  var reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // No IO support — show everything immediately, then continue with the rest.
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    initReveals();
  }

  function initReveals() {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
      if (delay > 0) {
        setTimeout(function () { el.classList.add('in'); }, delay);
      } else {
        el.classList.add('in');
      }
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(function (el) { io.observe(el); });
  }

  // ---------- Header shadow on scroll ----------
  var header = document.querySelector('.site-header');
  var lastScroll = -1;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (Math.abs(y - lastScroll) < 4) return;
    lastScroll = y;
    if (header) {
      header.style.boxShadow = y > 8 ? '0 6px 18px rgba(0,0,0,.18)' : 'none';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Smooth-scroll offset for sticky header on anchor clicks ----------
  // Skip the accessibility skip-link and any opt-out anchors so native focus behaviour stays intact.
  document.querySelectorAll('a[href^="#"]:not(.skip-link):not([data-no-smooth])').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = 72;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
      // Move keyboard/screen-reader focus to the target for accessibility.
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      // Update URL without jumping
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });
})();

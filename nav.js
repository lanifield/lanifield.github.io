/**
 * nav.js — Lani Raukawa Field · lanifield.nz
 *
 * Manages the mobile navigation:
 *   - Toggles aria-expanded on the hamburger button
 *   - Adds/removes .is-open on the nav overlay
 *   - Closes on Escape key
 *   - Closes on click outside the nav
 *   - Closes when a nav link is clicked (mobile SPA-style)
 *   - Restores body scroll when nav closes
 *
 * No dependencies. Plain ES5-compatible.
 */

(function () {
  'use strict';

  var toggle  = document.getElementById('nav-toggle')
             || document.querySelector('.nav-toggle');
  var nav     = document.getElementById('site-nav');

  /* Guard — if elements aren't present, do nothing */
  if (!toggle || !nav) return;

  /* ── State ──────────────────────────────────── */

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  /* ── Open / Close ───────────────────────────── */

  function openNav() {
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
    document.body.style.overflow = 'hidden';  /* prevent scroll-through */
    toggle.setAttribute('aria-label', 'Close navigation menu');

    /* Move focus to first link for keyboard users */
    var firstLink = nav.querySelector('a, button');
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-label', 'Open navigation menu');
  }

  function toggleNav() {
    if (isOpen()) {
      closeNav();
    } else {
      openNav();
    }
  }

  /* ── Event listeners ────────────────────────── */

  /* Hamburger button click */
  toggle.addEventListener('click', toggleNav);

  /* Escape key closes nav */
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.keyCode === 27) && isOpen()) {
      closeNav();
      toggle.focus();  /* return focus to toggle */
    }
  });

  /* Click outside nav closes it */
  document.addEventListener('click', function (e) {
    if (!isOpen()) return;
    if (nav.contains(e.target)) return;
    if (toggle.contains(e.target)) return;
    closeNav();
  });

  /* Clicking a nav link closes the menu (mobile) */
  var navLinks = nav.querySelectorAll('.site-nav__link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (isOpen()) closeNav();
    });
  });

  /* ── Resize: close mobile nav if window widens ── */
  /* Uses matchMedia so resize events don't fire constantly */

  var mq = window.matchMedia('(min-width: 800px)');

  function handleBreakpoint(e) {
    if (e.matches && isOpen()) {
      closeNav();
    }
  }

  /* addListener is deprecated but safer for older iOS/Android */
  if (mq.addEventListener) {
    mq.addEventListener('change', handleBreakpoint);
  } else if (mq.addListener) {
    mq.addListener(handleBreakpoint);
  }

  /* ── Active page highlight ──────────────────── */
  /*
   * Sets aria-current="page" and the --active class
   * on the nav link that matches the current URL.
   * Handles both root (/) and named pages.
   */

  var links = nav.querySelectorAll('.site-nav__link');
  var currentPath = window.location.pathname;

  links.forEach(function (link) {
    var href = link.getAttribute('href');

    /* Normalise: strip trailing slash, lowercase */
    var normHref    = href.replace(/\/$/, '').toLowerCase() || '/';
    var normCurrent = currentPath.replace(/\/$/, '').toLowerCase() || '/';

    /* Match exact path or basename (e.g. '/about.html' === 'about.html') */
    var basename = normCurrent.split('/').pop() || '';

    if (
      normHref === normCurrent ||
      normHref === basename ||
      (normHref === '/' && (normCurrent === '' || normCurrent === '/'))
    ) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('site-nav__link--active');
    } else {
      link.removeAttribute('aria-current');
      link.classList.remove('site-nav__link--active');
    }
  });

}());

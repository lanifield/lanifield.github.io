/**
 * cookie-consent.js — Lani Raukawa Field · lanifield.nz
 *
 * Manages cookie/analytics consent in two tiers:
 *   - Necessary only (default / decline)
 *   - Analytics included (accept)
 *
 * Microsoft Clarity is injected only when analytics
 * consent is explicitly granted and stored.
 *
 * Storage: localStorage key 'lrf_cookie_consent'
 * Values:  'necessary' | 'analytics' | null (undecided)
 *
 * The banner is shown once; the cookie-settings button
 * in the footer re-opens it on request.
 */

(function () {
  'use strict';

  /* ── Constants ─────────────────────────────── */

  const STORAGE_KEY  = 'lrf_cookie_consent';
  const VAL_NECESSARY = 'necessary';
  const VAL_ANALYTICS = 'analytics';

  /**
   * Replace the empty string below with your real
   * Microsoft Clarity project ID once you have one.
   */
  const CLARITY_ID = '';   /* e.g. 'abc123xyz' */

  /* ── Helpers ────────────────────────────────── */

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* localStorage unavailable — silently continue */
    }
  }

  /* ── Clarity injection ──────────────────────── */

  function injectClarity() {
    if (!CLARITY_ID) return;
    if (document.getElementById('ms-clarity')) return;  /* already injected */

    /* Microsoft Clarity loader snippet (minified / adapted) */
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };

    const script = document.createElement('script');
    script.id    = 'ms-clarity';
    script.async = true;
    script.src   = 'https://www.clarity.ms/tag/' + CLARITY_ID;
    document.head.appendChild(script);
  }

  /* ── Banner DOM construction ────────────────── */

  function createBanner() {
    const banner = document.createElement('div');
    banner.id              = 'cookie-banner';
    banner.className       = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.setAttribute('aria-live', 'polite');

    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <p class="cookie-banner__text">
          This site uses cookies to understand how it is used, so I can
          keep improving it. You can choose to allow analytics cookies
          (via Microsoft Clarity) or only the cookies that are strictly
          necessary for the site to work.
          <a href="terms.html#cookies">Read the cookie policy</a>.
        </p>
        <div class="cookie-banner__actions">
          <button
            type="button"
            id="cookie-accept"
            class="btn btn--primary"
            aria-label="Accept analytics cookies">
            Accept analytics
          </button>
          <button
            type="button"
            id="cookie-decline"
            class="btn btn--secondary"
            aria-label="Use necessary cookies only">
            Necessary only
          </button>
        </div>
      </div>
    `;

    return banner;
  }

  /* ── Show / hide ────────────────────────────── */

  function showBanner(banner) {
    document.body.appendChild(banner);

    /* Trigger CSS transition — rAF ensures class applied after render */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('is-visible');
      });
    });

    /* Move focus into the banner for keyboard users */
    const firstBtn = banner.querySelector('button');
    if (firstBtn) firstBtn.focus();
  }

  function hideBanner(banner) {
    banner.classList.remove('is-visible');

    /* Remove from DOM after transition ends */
    banner.addEventListener('transitionend', function handler() {
      banner.removeEventListener('transitionend', handler);
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    });
  }

  /* ── Event wiring ───────────────────────────── */

  function wireBannerButtons(banner) {
    const acceptBtn  = banner.querySelector('#cookie-accept');
    const declineBtn = banner.querySelector('#cookie-decline');

    acceptBtn.addEventListener('click', function () {
      setConsent(VAL_ANALYTICS);
      injectClarity();
      hideBanner(banner);
      announceChoice('Analytics cookies accepted.');
    });

    declineBtn.addEventListener('click', function () {
      setConsent(VAL_NECESSARY);
      hideBanner(banner);
      announceChoice('Necessary cookies only — no analytics.');
    });
  }

  /* Polite announcement for screen readers */
  function announceChoice(message) {
    const el = document.getElementById('sr-announcement') ||
               createAnnouncementEl();
    el.textContent = message;
  }

  function createAnnouncementEl() {
    const el = document.createElement('div');
    el.id = 'sr-announcement';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.className = 'sr-only';
    document.body.appendChild(el);
    return el;
  }

  /* Cookie-settings button in footer re-opens the banner */
  function wireSettingsButton() {
    const btn = document.getElementById('cookie-settings-toggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      /* Remove old preference so banner re-shows */
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }

      const existing = document.getElementById('cookie-banner');
      if (existing) return;  /* already open */

      const banner = createBanner();
      wireBannerButtons(banner);
      showBanner(banner);
    });
  }

  /* ── Init ───────────────────────────────────── */

  function init() {
    const consent = getConsent();

    /* If analytics was previously accepted, inject Clarity immediately */
    if (consent === VAL_ANALYTICS) {
      injectClarity();
    }

    /* If no decision recorded yet, show the banner */
    if (consent === null) {
      const banner = createBanner();
      wireBannerButtons(banner);
      /* Slight delay so page paints before banner slides up */
      setTimeout(function () { showBanner(banner); }, 800);
    }

    /* Always wire the footer settings button */
    wireSettingsButton();
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());

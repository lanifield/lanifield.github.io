/**
 * journal-preview.js — Lani Raukawa Field · lanifield.nz
 *
 * Fetches journal.json and renders the three most
 * recent entries as cards in #journal-preview-grid.
 *
 * If the fetch fails or JS is disabled, the static
 * fallback message in the HTML remains visible.
 *
 * Expected journal.json shape:
 * {
 *   "entries": [
 *     {
 *       "id":       "unique-slug",
 *       "title":    "Entry title",
 *       "excerpt":  "Short summary text.",
 *       "category": "UX Research",
 *       "date":     "2025-02-15",          // ISO 8601
 *       "readTime": "5 min read",
 *       "url":      "journal/entry-slug.html"
 *     },
 *     ...
 *   ]
 * }
 *
 * Entries should be ordered newest-first in the JSON,
 * or this script will sort them by date descending.
 */

(function () {
  'use strict';

  var GRID_ID     = 'journal-preview-grid';
  var FALLBACK_ID = 'journal-preview-fallback';
  var JSON_URL    = 'assets/data/journal.json';
  var MAX_CARDS   = 3;

  /* ── DOM helpers ────────────────────────────── */

  var grid = document.getElementById(GRID_ID);
  if (!grid) return;  /* not on homepage */

  /* ── Date formatting ────────────────────────── */

  /**
   * Formats an ISO date string to a human-readable form.
   * Uses Intl.DateTimeFormat where available, falls back
   * to a simple manual formatter.
   * @param {string} iso  e.g. '2025-02-15'
   * @returns {string}    e.g. '15 Feb 2025'
   */
  function formatDate(iso) {
    var parts = iso.split('-');
    if (parts.length < 3) return iso;

    var d = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );

    if (isNaN(d.getTime())) return iso;

    try {
      return new Intl.DateTimeFormat('en-NZ', {
        day:   'numeric',
        month: 'short',
        year:  'numeric'
      }).format(d);
    } catch (e) {
      /* Fallback for environments without Intl */
      var months = [
        'Jan','Feb','Mar','Apr','May','Jun',
        'Jul','Aug','Sep','Oct','Nov','Dec'
      ];
      return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    }
  }

  /* ── Escape HTML ────────────────────────────── */

  function escapeHtml(str) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return String(str).replace(/[&<>"']/g, function (c) { return map[c]; });
  }

  /* ── Card template ──────────────────────────── */

  /**
   * Builds the HTML string for a single journal card.
   * The card link wraps the entire card via an ::after
   * pseudo-element (defined in components.css), with
   * the title <a> providing the accessible label.
   */
  function buildCard(entry) {
    var formattedDate = formatDate(entry.date);
    var safeTitle    = escapeHtml(entry.title);
    var safeExcerpt  = escapeHtml(entry.excerpt);
    var safeCategory = escapeHtml(entry.category);
    var safeReadTime = entry.readTime ? escapeHtml(entry.readTime) : '';
    var safeUrl      = escapeHtml(entry.url);

    return '<li class="card">' +
      '<span class="card__category">' + safeCategory + '</span>' +
      '<h3 class="card__title">' +
        '<a href="' + safeUrl + '">' + safeTitle + '</a>' +
      '</h3>' +
      '<p class="card__excerpt">' + safeExcerpt + '</p>' +
      '<div class="card__meta">' +
        '<time class="card__date" datetime="' + escapeHtml(entry.date) + '">' +
          formattedDate +
        '</time>' +
        (safeReadTime
          ? '<span class="card__read-time">' + safeReadTime + '</span>'
          : '') +
      '</div>' +
    '</li>';
  }

  /* ── Render ─────────────────────────────────── */

  function renderCards(entries) {
    /* Sort newest-first by date (ISO strings sort correctly) */
    var sorted = entries.slice().sort(function (a, b) {
      return b.date < a.date ? -1 : b.date > a.date ? 1 : 0;
    });

    var latest = sorted.slice(0, MAX_CARDS);

    /* Hide the loading fallback */
    var fallback = document.getElementById(FALLBACK_ID);
    if (fallback) fallback.style.display = 'none';

    /* Append cards */
    var html = latest.map(buildCard).join('');
    grid.insertAdjacentHTML('beforeend', html);
  }

  /* ── Error state ────────────────────────────── */

  function showError(message) {
    var fallback = document.getElementById(FALLBACK_ID);
    if (fallback) {
      fallback.innerHTML =
        '<p>' + escapeHtml(message) + '</p>' +
        '<p><a href="journal.html">Browse all journal entries</a>.</p>';
    }
  }

  /* ── Fetch ──────────────────────────────────── */

  /**
   * Uses fetch if available, XMLHttpRequest as fallback.
   * Both paths call renderCards(entries) on success.
   */
  function loadJournal() {
    if (typeof fetch === 'function') {

      fetch(JSON_URL)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Network response was not ok (' + response.status + ')');
          }
          return response.json();
        })
        .then(function (data) {
          if (!data || !Array.isArray(data.entries) || data.entries.length === 0) {
            showError('No journal entries found yet.');
            return;
          }
          renderCards(data.entries);
        })
        .catch(function () {
          showError('Could not load journal entries at this time.');
        });

    } else {

      /* XMLHttpRequest fallback for older environments */
      var xhr = new XMLHttpRequest();
      xhr.open('GET', JSON_URL, true);
      xhr.responseType = 'text';

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            var data = JSON.parse(xhr.responseText);
            if (!data || !Array.isArray(data.entries) || data.entries.length === 0) {
              showError('No journal entries found yet.');
              return;
            }
            renderCards(data.entries);
          } catch (e) {
            showError('Could not read journal data.');
          }
        } else {
          showError('Could not load journal entries at this time.');
        }
      };

      xhr.onerror = function () {
        showError('Could not load journal entries at this time.');
      };

      xhr.send();
    }
  }

  /* ── Boot ───────────────────────────────────── */

  loadJournal();

}());

(() => {
  'use strict';
  const config = document.currentScript?.dataset || {};
  document.querySelector('[data-print-checklist]')?.addEventListener('click', () => window.print());
  const storageKey = 'vcv_cookie_consent';
  const banner = document.getElementById('cookie-banner');
  const nav = document.getElementById('primary-navigation');
  const toggle = document.querySelector('.nav-toggle');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  if (nav && toggle) {
    document.documentElement.classList.add('js');
    toggle.hidden = false;
    const close = () => {
      nav.classList.remove('nav-abierto');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    };
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('nav-abierto');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('nav-abierto')) {
        close();
        toggle.focus();
      }
    });
  }
  let enabled = false;
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link || !enabled || !config.analyticsId || typeof window.gtag !== 'function') return;
    const target = new URL(link.href, location.href);
    if (target.hostname !== 'www.instagram.com' || target.pathname !== '/viveconuve71/') return;
    // Separate from GA4's generic outbound click; never send query strings or user inputs.
    window.gtag('event', 'instagram_outbound', {
      page_path: location.pathname,
      placement: link.closest('.site-footer')
        ? 'footer'
        : link.closest('.author')
          ? 'author'
          : 'content',
      transport_type: 'beacon',
    });
  });
  function enableOptionalServices() {
    // Never mix previews or development visits with production analytics.
    const production = ['https://viveconuve.com', 'https://www.viveconuve.com'];
    if (enabled || !production.includes(new URL(location.href).origin)) return;
    enabled = true;
    if (config.analyticsId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', config.analyticsId);
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.analyticsId)}`;
      document.head.append(script);
      // Empty analyticsId also excludes Metricool from private tools.
      const metricool = document.createElement('script');
      metricool.async = true;
      metricool.src = 'https://tracker.metricool.com/resources/be.js';
      let tracked = false;
      metricool.onload = () => {
        if (tracked || typeof window.beTracker?.t !== 'function') return;
        tracked = true;
        window.beTracker.t({ hash: 'c0405db629db5693b413626d53d6bcc4' });
      };
      document.head.append(metricool);
    }
    if (config.adsenseId) {
      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.adsenseId)}`;
      document.head.append(script);
    }
  }
  let consent = null;
  try {
    consent = localStorage.getItem(storageKey);
  } catch {
    /* Consent remains undecided when storage is unavailable. */
  }
  if (consent === 'accepted') enableOptionalServices();
  if (banner) {
    banner.hidden = consent === 'accepted' || consent === 'rejected';
    banner.querySelectorAll('[data-cookie-action]').forEach((button) =>
      button.addEventListener('click', () => {
        const accepted = button.dataset.cookieAction === 'accept';
        try {
          localStorage.setItem(storageKey, accepted ? 'accepted' : 'rejected');
        } catch {
          /* Keep this choice for the current page. */
        }
        banner.hidden = true;
        if (accepted) enableOptionalServices();
        else if (enabled) location.reload();
      }),
    );
    document.querySelector('[data-cookie-settings]')?.addEventListener('click', () => {
      banner.hidden = false;
      banner.querySelector('button')?.focus();
    });
  }
})();

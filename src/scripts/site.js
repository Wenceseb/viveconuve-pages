(() => {
  'use strict';
  const config = document.currentScript?.dataset || {};
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
  function enableOptionalServices() {
    if (enabled) return;
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

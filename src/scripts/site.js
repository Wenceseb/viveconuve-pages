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
    let lastMenuFocus = null;
    const outsideMenu = (target) => !nav.contains(target) && !toggle.contains(target);
    document.addEventListener('pointerdown', (event) => {
      if (outsideMenu(event.target)) {
        lastMenuFocus = null;
        close();
      }
    });
    document.addEventListener('focusin', (event) => {
      lastMenuFocus = outsideMenu(event.target) ? null : event.target;
      if (outsideMenu(event.target)) close();
    });
    const mobileNavigation = window.matchMedia('(max-width: 768px)');
    mobileNavigation.addEventListener('change', () => {
      const active =
        document.activeElement === document.body ? lastMenuFocus : document.activeElement;
      close();
      if (mobileNavigation.matches && nav.contains(active)) toggle.focus();
      else if (!mobileNavigation.matches && active === toggle) nav.querySelector('a')?.focus();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('nav-abierto')) {
        close();
        toggle.focus();
      }
    });
  }
  const journeyKey = 'vcv_pending_journey';
  const journeyDestinations = {
    '/camino-a-hyrox.html': 'camino',
    '/athlonx-fuengirola-2026-cronica.html': 'fuengirola',
    '/atlhonx-cordoba-caliphate-2026.html': 'cordoba',
    '/10k-santa-fe-2026.html': 'santa_fe',
    '/hyrox-despues-de-los-50.html': 'guia_hyrox',
  };
  function sendPendingJourney() {
    try {
      const raw = sessionStorage.getItem(journeyKey);
      sessionStorage.removeItem(journeyKey);
      if (!raw) return;
      const pending = JSON.parse(raw);
      if (
        pending.target !== location.pathname ||
        Date.now() - pending.created > 60000 ||
        Date.now() < pending.created ||
        !Number.isFinite(pending.created) ||
        !/^\/(?:[a-z0-9-]{1,160}\.html)?$/.test(pending.source) ||
        !['header', 'footer', 'author', 'content'].includes(pending.placement) ||
        !['camino', 'fuengirola', 'cordoba', 'santa_fe', 'guia_hyrox', 'newsletter'].includes(
          pending.destination,
        ) ||
        ![journeyDestinations[pending.target], 'newsletter'].includes(pending.destination)
      )
        return;
      window.gtag('event', 'journey_click', {
        page_path: pending.source,
        destination: pending.destination,
        placement: pending.placement,
        transport_type: 'beacon',
      });
    } catch {
      /* Storage restrictions never block navigation or reading. */
    }
  }
  let enabled = false;
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link || !enabled || !config.analyticsId || typeof window.gtag !== 'function') return;
    const target = new URL(link.href, location.href);
    const placement = link.closest('.site-footer')
      ? 'footer'
      : link.closest('.site-header')
        ? 'header'
        : link.closest('.author')
          ? 'author'
          : 'content';
    if (target.origin === new URL(location.href).origin) {
      const newsletter =
        target.hash === '#newsletter' &&
        ['/', '/index.html', '/camino-a-hyrox.html'].includes(target.pathname);
      const destination = newsletter ? 'newsletter' : journeyDestinations[target.pathname];
      if (destination) {
        const parameters = {
          page_path: location.pathname,
          destination,
          placement,
          transport_type: 'beacon',
        };
        const sameTabNavigation =
          target.pathname !== location.pathname &&
          !event.defaultPrevented &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.shiftKey &&
          !event.altKey &&
          (!event.button || event.button === 0) &&
          (!link.target || link.target === '_self') &&
          !link.hasAttribute?.('download');
        if (sameTabNavigation) {
          try {
            sessionStorage.setItem(
              journeyKey,
              JSON.stringify({
                source: location.pathname,
                target: target.pathname,
                destination,
                placement,
                created: Date.now(),
              }),
            );
            return;
          } catch {
            /* Fall back to the immediate event when session storage is unavailable. */
          }
        }
        window.gtag('event', 'journey_click', parameters);
      }
      return;
    }
    const instagram =
      target.hostname === 'www.instagram.com' && target.pathname === '/viveconuve71/';
    const facebook =
      target.hostname === 'www.facebook.com' &&
      ['/1471635009356505', '/1471635009356505/'].includes(target.pathname);
    if (!instagram && !facebook) return;
    // Separate from GA4's generic outbound click; never send query strings or user inputs.
    window.gtag('event', instagram ? 'instagram_outbound' : 'facebook_outbound', {
      page_path: location.pathname,
      placement,
      transport_type: 'beacon',
    });
  });
  document.addEventListener('submit', (event) => {
    if (
      !enabled ||
      !config.analyticsId ||
      typeof window.gtag !== 'function' ||
      event.target?.id !== 'sib-form'
    )
      return;
    // This is an attempted native submission, never a confirmed subscription.
    window.gtag('event', 'newsletter_submit', {
      page_path: location.pathname,
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
      sendPendingJourney();
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

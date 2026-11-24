import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../src/scripts/site.js', import.meta.url), 'utf8');
function harness(
  saved = null,
  blockedStorage = false,
  privateTool = false,
  origin = 'https://viveconuve.com',
  sessionMemory = null,
  pathname = '/',
) {
  const loaded = [],
    scripts = [],
    handlers = {},
    memory = { value: saved };
  let reloads = 0;
  const timers = new Map();
  const navigations = [];
  let timerId = 0;
  const buttons = ['accept', 'reject'].map((action) => ({
    dataset: { cookieAction: action },
    addEventListener: (type, fn) => (handlers[action] = fn),
    focus() {},
  }));
  const banner = { hidden: true, querySelectorAll: () => buttons, querySelector: () => buttons[0] };
  const document = {
    addEventListener: (type, fn) => (handlers[type] = fn),
    currentScript: {
      dataset: {
        analyticsId: privateTool ? '' : 'G-TEST',
        adsenseId: privateTool ? '' : 'ca-test',
      },
    },
    getElementById: (id) => (id === 'cookie-banner' ? banner : null),
    querySelector: () => null,
    createElement: () => ({}),
    head: {
      append: (script) => {
        loaded.push(script.src);
        scripts.push(script);
      },
    },
  };
  const storage = {
    getItem() {
      if (blockedStorage) throw Error('blocked');
      return memory.value;
    },
    setItem(key, value) {
      if (blockedStorage) throw Error('blocked');
      memory.value = value;
    },
  };
  const browserWindow = {};
  runInNewContext(source, {
    document,
    window: browserWindow,
    localStorage: storage,
    location: {
      reload: () => reloads++,
      assign: (url) => navigations.push(url),
      href: origin + pathname + '?private=value',
      pathname,
    },
    ...(sessionMemory
      ? {
          sessionStorage: {
            getItem: () => sessionMemory.value,
            setItem: (key, value) => {
              sessionMemory.value = value;
            },
            removeItem: () => {
              sessionMemory.value = null;
            },
          },
        }
      : {}),
    URL,
    encodeURIComponent,
    Date,
    setTimeout: (fn, delay) => {
      const id = ++timerId;
      timers.set(id, { fn, delay });
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
  });
  return {
    loaded,
    scripts,
    handlers,
    banner,
    memory,
    browserWindow,
    timers,
    navigations,
    reloads: () => reloads,
  };
}

test('journey continuation is sent once on the destination without delaying navigation', () => {
  const memory = { value: null };
  const source = harness(
    'accepted',
    false,
    false,
    'https://viveconuve.com',
    memory,
    '/articulos.html',
  );
  source.handlers.click({
    target: {
      closest: () => ({
        href: 'https://viveconuve.com/camino-a-hyrox.html?private=value',
        closest: () => null,
      }),
    },
  });
  assert.ok(memory.value);
  assert.ok(!memory.value.includes('private'));
  assert.equal(source.browserWindow.dataLayer.filter((e) => e[1] === 'journey_click').length, 0);
  const destination = harness(
    'accepted',
    false,
    false,
    'https://viveconuve.com',
    memory,
    '/camino-a-hyrox.html',
  );
  const sent = destination.browserWindow.dataLayer.at(-1);
  assert.equal(sent[1], 'journey_click');
  assert.equal(sent[2].page_path, '/articulos.html');
  assert.equal(sent[2].destination, 'camino');
  assert.equal(memory.value, null);
  const again = harness(
    'accepted',
    false,
    false,
    'https://viveconuve.com',
    memory,
    '/camino-a-hyrox.html',
  );
  assert.equal(again.browserWindow.dataLayer.filter((e) => e[1] === 'journey_click').length, 0);
});

test('Instagram measurement requires consent and excludes URL queries', () => {
  const h = harness();
  const event = {
    target: {
      closest: () => ({ href: 'https://www.instagram.com/viveconuve71/', closest: () => null }),
    },
  };
  h.handlers.click(event);
  assert.equal(h.browserWindow.dataLayer, undefined);
  h.handlers.accept();
  h.handlers.click(event);
  const sent = Array.from(h.browserWindow.dataLayer.at(-1));
  assert.equal(sent[1], 'instagram_outbound');
  assert.equal(sent[2].page_path, '/');
  assert.equal(sent[2].placement, 'content');
  assert.ok(!JSON.stringify(sent).includes('private'));
  assert.equal(h.browserWindow.dataLayer.filter((e) => e[1] === 'instagram_outbound').length, 1);
});

test('internal journey events use a fixed destination without queries or private input', () => {
  const click = (h, href) =>
    h.handlers.click({ target: { closest: () => ({ href, closest: () => null }) } });
  const h = harness();
  click(h, 'https://viveconuve.com/camino-a-hyrox.html?secret=value');
  assert.equal(h.browserWindow.dataLayer, undefined);
  h.handlers.accept();
  click(h, 'https://viveconuve.com/camino-a-hyrox.html?secret=value#newsletter');
  const sent = Array.from(h.browserWindow.dataLayer.at(-1));
  assert.equal(sent[1], 'journey_click');
  assert.equal(sent[2].destination, 'newsletter');
  assert.ok(!JSON.stringify(sent).includes('secret'));
  click(h, 'https://viveconuve.com/athlonx-fuengirola-2026-cronica.html?secret=value');
  assert.equal(h.browserWindow.dataLayer.at(-1)[2].destination, 'fuengirola');
  assert.ok(!JSON.stringify(h.browserWindow.dataLayer.at(-1)).includes('secret'));
  const count = h.browserWindow.dataLayer.length;
  click(h, 'https://viveconuve.com/mi-progreso.html?private=notes');
  click(h, 'https://another.example/camino-a-hyrox.html');
  assert.equal(h.browserWindow.dataLayer.length, count);
});

test('newsletter attempts require public consent and never include the email or form contents', () => {
  const event = { target: { id: 'sib-form', email: 'private@example.invalid' } };
  for (const h of [
    harness(),
    harness('rejected'),
    harness('accepted', false, true),
    harness('accepted', false, false, 'http://localhost:8081'),
  ]) {
    h.handlers.submit(event);
    assert.equal(h.browserWindow.dataLayer, undefined);
  }
  const h = harness('accepted');
  h.handlers.submit(event);
  const sent = Array.from(h.browserWindow.dataLayer.at(-1));
  assert.equal(sent[1], 'newsletter_submit');
  assert.equal(sent[2].page_path, '/');
  assert.ok(!JSON.stringify(sent).includes('private'));
  const count = h.browserWindow.dataLayer.length;
  h.handlers.submit({ target: { id: 'another-form' } });
  assert.equal(h.browserWindow.dataLayer.length, count);
});
test('optional services are not requested before consent', () => {
  const h = harness();
  assert.equal(h.banner.hidden, false);
  assert.deepEqual(h.loaded, []);
});

test('previews never send analytics or advertising, even with saved or new consent', () => {
  for (const origin of [
    'http://127.0.0.1:8097',
    'http://localhost:8081',
    'https://preview.example.com',
    'http://viveconuve.com',
    'https://viveconuve.com:8097',
  ]) {
    for (const consent of [null, 'accepted']) {
      const h = harness(consent, false, false, origin);
      h.handlers.accept();
      h.handlers.click({
        target: {
          closest: () => ({ href: 'https://www.instagram.com/viveconuve71/', closest: () => null }),
        },
      });
      assert.deepEqual(h.loaded, [], origin);
      assert.equal(h.browserWindow.dataLayer, undefined);
    }
  }
  assert.equal(harness('accepted', false, false, 'https://www.viveconuve.com').loaded.length, 3);
});
test('rejecting consent persists the choice and requests no trackers', () => {
  const h = harness();
  h.handlers.reject();
  assert.equal(h.memory.value, 'rejected');
  assert.equal(h.banner.hidden, true);
  assert.equal(h.loaded.length, 0);
});
test('accepting consent loads each optional service only once', () => {
  const h = harness();
  h.handlers.accept();
  h.handlers.accept();
  assert.equal(h.memory.value, 'accepted');
  assert.equal(h.loaded.length, 3);
});
test('saved consent is respected on subsequent pages', () => {
  assert.equal(harness('accepted').loaded.length, 3);
  const h = harness('rejected');
  assert.equal(h.loaded.length, 0);
  assert.equal(h.banner.hidden, true);
});
test('storage restrictions do not break the page or assume consent', () => {
  const h = harness(null, true);
  assert.equal(h.loaded.length, 0);
  h.handlers.reject();
  assert.equal(h.banner.hidden, true);
});
test('withdrawing previous consent reloads after saving rejection', () => {
  const h = harness('accepted');
  h.handlers.reject();
  assert.equal(h.memory.value, 'rejected');
  assert.equal(h.reloads(), 1);
});

test('Metricool receives the supplied hash once after its script loads', () => {
  const h = harness();
  const visits = [];
  h.browserWindow.beTracker = { t: (value) => visits.push(value.hash) };
  assert.equal(h.scripts.length, 0);
  h.handlers.accept();
  const tracker = h.scripts.find((s) => s.src === 'https://tracker.metricool.com/resources/be.js');
  assert.ok(tracker);
  assert.deepEqual(visits, []);
  tracker.onload();
  tracker.onload();
  assert.deepEqual(visits, ['c0405db629db5693b413626d53d6bcc4']);
});
test('private tools never load optional analytics including Metricool, even with consent', () => {
  assert.deepEqual(harness('accepted', false, true).loaded, []);
});
test('blocked Metricool does not break the page when its API is unavailable', () => {
  const h = harness('accepted');
  const tracker = h.scripts.find((s) => s.src.includes('metricool'));
  assert.doesNotThrow(() => tracker.onload());
});

test('Facebook clicks respect consent, exact account, production and private-tool exclusions', () => {
  const click = (h, href) =>
    h.handlers.click({ target: { closest: () => ({ href, closest: () => null }) } });
  for (const h of [
    harness(),
    harness('rejected'),
    harness('accepted', false, true),
    harness('accepted', false, false, 'http://localhost:8081'),
  ]) {
    click(h, 'https://www.facebook.com/1471635009356505');
    assert.equal(h.browserWindow.dataLayer, undefined);
  }
  const h = harness('accepted');
  click(h, 'https://www.facebook.com/another-account');
  assert.equal(h.browserWindow.dataLayer.length, 2);
  click(h, 'https://www.facebook.com/1471635009356505?private=value');
  const sent = Array.from(h.browserWindow.dataLayer.at(-1));
  assert.equal(sent[1], 'facebook_outbound');
  assert.equal(sent[2].page_path, '/');
  assert.ok(!JSON.stringify(sent).includes('private'));
});

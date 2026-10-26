import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../src/scripts/site.js', import.meta.url), 'utf8');
function harness(saved = null, blockedStorage = false, privateTool = false) {
  const loaded = [],
    scripts = [],
    handlers = {},
    memory = { value: saved };
  let reloads = 0;
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
      href: 'https://viveconuve.com/?private=value',
      pathname: '/',
    },
    URL,
    encodeURIComponent,
    Date,
  });
  return { loaded, scripts, handlers, banner, memory, browserWindow, reloads: () => reloads };
}

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
test('optional services are not requested before consent', () => {
  const h = harness();
  assert.equal(h.banner.hidden, false);
  assert.deepEqual(h.loaded, []);
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

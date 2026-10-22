import test from 'node:test';
import assert from 'node:assert/strict';
import { isSupportedNode, requiredVersion } from '../scripts/check-runtime.mjs';

test('runtime policy rejects versions missing verified security patches', () => {
  for (const version of ['22.19.0', '22.23.3', '20.20.0', '22.23.4-rc.1', 'invalid']) {
    assert.equal(isSupportedNode(version), false, version);
  }
});

test('runtime policy accepts the baseline and newer same-major patches', () => {
  assert.equal(isSupportedNode(requiredVersion), true);
  assert.equal(isSupportedNode('22.23.5'), true);
  assert.equal(isSupportedNode('22.24.0'), true);
});

test('major upgrades require an explicit compatibility review', () => {
  assert.equal(isSupportedNode('24.22.1'), false);
  assert.equal(isSupportedNode('26.12.1'), false);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scan } from '../scanner';

test('scan finds all 4 marker shapes in a real conflict', () => {
  const text = [
    '<<<<<<< HEAD',
    'ours',
    '|||||||  merged common ancestors',
    'base',
    '=======',
    'theirs',
    '>>>>>>> feature-branch',
  ].join('\n');
  const hits = scan(text);
  assert.equal(hits.length, 4);
  assert.deepEqual(
    hits.map((h) => h.line),
    [1, 3, 5, 7],
  );
});

test('scan finds a bare 3-way conflict (no diff3 base section)', () => {
  const text = ['<<<<<<< HEAD', 'ours', '=======', 'theirs', '>>>>>>> feature'].join('\n');
  const hits = scan(text);
  assert.equal(hits.length, 3);
});

test('scan finds nothing in clean text', () => {
  assert.deepEqual(scan('just some normal code\nno markers here'), []);
});

test('scan does not false-positive on 6 or 8 angle brackets', () => {
  assert.deepEqual(scan('<<<<<< not quite'), []);
  assert.deepEqual(scan('<<<<<<<< too many'), []);
});

test('scan requires the ======= line to be exactly 7 chars, nothing else', () => {
  assert.equal(scan('=======').length, 1);
  assert.equal(scan('======= trailing text').length, 0);
});

import fs from 'fs';
import path from 'path';
import url from 'url';

import { test, expect, beforeAll } from '@jest/globals';
import buildSearchEngine from '../src/index.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixtureFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let fixtures = null;
const fixtureNames = ['garbage_patch_NG', 'garbage_patch_ocean_clean', 'garbage_patch_spam', 'garbage_patch_wiki'];

beforeAll(() => {
  fixtures = fixtureNames.map((name) => ({ id: name, text: readFixtureFile(name) }));
});

test('simple search', () => {
  const expected = [
    'garbage_patch_NG',
    'garbage_patch_ocean_clean',
    'garbage_patch_wiki',
  ];
  const collection = fixtures.filter(({ id }) => id !== 'garbage_patch_spam');
  const searchEngine = buildSearchEngine(collection);

  expect(searchEngine.search('trash island')).toEqual(expected);
});

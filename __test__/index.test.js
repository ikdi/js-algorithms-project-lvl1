import { test, expect } from '@jest/globals';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';

import buildSearchEngine from '../src/index.js';

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
// const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('relevant search', () => {
  const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
  const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
  const doc3 = { id: 'doc3', text: "I'm your shooter." };
  const docs = [doc1, doc2, doc3];

  const searchEngine = buildSearchEngine(docs);

  searchEngine.search('shoot');

  expect(searchEngine.search('shoot')).toEqual(['doc2', 'doc1']);
});

test('search with term processing', () => {
  const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
  const docs = [doc1];

  const searchEngine = buildSearchEngine(docs);
  expect(searchEngine.search('pint')).toEqual(['doc1']);
  expect(searchEngine.search('pint!')).toEqual(['doc1']);
});

import { test, expect, beforeAll } from '@jest/globals';
import buildSearchEngine from '../src/index.js';

const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
const doc3 = { id: 'doc3', text: "I'm your shooter." };
const collection = [doc1, doc2, doc3];

let searchEngine = null;

beforeAll(() => {
  searchEngine = buildSearchEngine(collection);
});

test('search one word', () => {
  expect(searchEngine.search('shoot')).toEqual(['doc2', 'doc1']);
});

test('search a sentence', () => {
  expect(searchEngine.search('shoot at me')).toEqual(['doc2', 'doc1']);
});

test('search a word that doesnot exist', () => {
  expect(searchEngine.search('ooooops')).toEqual([]);
});

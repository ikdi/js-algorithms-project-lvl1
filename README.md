### Hexlet tests and linter status:
[![Actions Status](https://github.com/kdi-course/js-algorithms-project-lvl1/workflows/hexlet-check/badge.svg)](https://github.com/kdi-course/js-algorithms-project-lvl1/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/be2f4bb6a9a64883f427/maintainability)](https://codeclimate.com/github/ikdi/js-algorithms-project-lvl1/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/be2f4bb6a9a64883f427/test_coverage)](https://codeclimate.com/github/ikdi/js-algorithms-project-lvl1/test_coverage)

This is the implementation of training Hexlet project [Search Engine (JS: Algorithms and Data Structures №1)](https://ru.hexlet.io/programs/js-algorithms/projects/69)

**Search Engine**

The basic algorithms and data structures in search engines are studied. In practice, various search methods, indexing, ranking, relevance metrics are used, and an inverse index is built.

_Usage Example:_

```js
import buildSearchEngine from '@hexlet-code';

const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
const doc3 = { id: 'doc3', text: "I'm your shooter." };
const docs = [doc1, doc2, doc3];

const searchEngine = buildSearchEngine(docs);

searchEngine.search('shoot'); // ['doc1', 'doc2']
```
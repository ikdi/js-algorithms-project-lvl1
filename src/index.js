import words from 'lodash/words';

const toDocumentTerms = (collection) => collection.map(
  ({ id, text }) => ({ id, terms: words(text) }),
);

const calcTdIdf = (
  termDocumentFrequency,
  documentSize,
  collectionSize,
  termCollectionFrequency,
) => (
  (termDocumentFrequency / documentSize) * Math.log2(1 + collectionSize / termCollectionFrequency)
);

const buildIndex = (documentTerms) => documentTerms.reduce((acc, { id, terms }) => terms
  .reduce((accDocument, term) => {
    const list = accDocument[term] ?? {};
    // eslint-disable-next-line no-param-reassign
    accDocument[term] = { ...list, [id]: (list[id] ?? 0) + 1 };
    return accDocument;
  }, acc), {});

const countStatistic = (documentTerms) => documentTerms.reduce(
  (acc, { id, terms }) => ({ ...acc, [id]: terms.length }),
  {},
);

const prepareEngine = (collectionSize, reverseIndex, statistics) => (query) => {
  const scores = {};
  const terms = words(query);
  // eslint-disable-next-line no-restricted-syntax
  for (const term of terms) {
    const list = reverseIndex[term];
    if (list) {
      const termCollectionFrequency = Object.keys(list).length;
      // eslint-disable-next-line no-restricted-syntax
      for (const [docId, termDocumentFrequency] of Object.entries(list)) {
        const score = calcTdIdf(
          termDocumentFrequency,
          statistics[docId],
          collectionSize,
          termCollectionFrequency,
        );
        const currentScore = scores[docId];
        scores[docId] = currentScore ? currentScore + score : score;
      }
    }
  }

  return Object
    .entries(scores)
    .sort(([, ascore], [, bscore]) => bscore - ascore)
    .map(([id]) => id);
};

const buildSearchEngine = (collection) => {
  const collectionSize = collection.length;

  const documentTerms = toDocumentTerms(collection);
  const reverseIndex = buildIndex(documentTerms);
  const statistics = countStatistic(documentTerms);

  return {
    search: prepareEngine(collectionSize, reverseIndex, statistics),
  };
};

export default buildSearchEngine;

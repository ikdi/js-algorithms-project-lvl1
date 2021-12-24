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

const sortScores = (scores) => Object
  .entries(scores)
  .sort(([, ascore], [, bscore]) => bscore - ascore)
  .map(([id]) => id);

const prepareEngine = (collectionSize, reverseIndex, statistics) => (query) => {
  const scores = {};
  const terms = words(query);

  terms.forEach((term) => {
    const list = reverseIndex[term];
    if (list) {
      const termCollectionFrequency = Object.keys(list).length;

      Object.entries(list).forEach(([docId, termDocumentFrequency]) => {
        const score = calcTdIdf(
          termDocumentFrequency,
          statistics[docId],
          collectionSize,
          termCollectionFrequency,
        );
        const currentScore = scores[docId];
        scores[docId] = currentScore ? currentScore + score : score;
      });
    }
  });

  return sortScores(scores);
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

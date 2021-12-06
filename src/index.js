import words from 'lodash/words';

const toDocumentTerms = (collection) => collection.map(
  ({ id, text }) => ({ id, terms: words(text) }),
);

const calcTdIdf = (
  termDocumentFrequency, documentSize, collectionSize, termCollectionFrequency,
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

const buildSearchEngine = (collection) => {
  const collectionSize = collection.length;

  const documentTerms = toDocumentTerms(collection);
  /* eslint-disable no-param-reassign */
  const reverseIndex = buildIndex(documentTerms);
  const statistics = countStatistic(documentTerms);

  // console.dir({ reverseIndex });
  console.dir({ statistics });

  return {
    search(query) {
      console.log('query:', query);
      const unsortedResult = {};
      // const terms = query.match(/\w+/g);
      const terms = words(query);
      // eslint-disable-next-line no-restricted-syntax
      for (const term of terms) {
        const list = reverseIndex[term];

        // console.dir({ query, term, list });
        if (list) {
          const termCollectionFrequency = Object.keys(list).length;
          // eslint-disable-next-line no-restricted-syntax
          for (const [docId, termDocumentFrequency] of Object.entries(list)) {
            let document = unsortedResult[docId];
            if (!document) {
              document = { id: docId, score: 0 };
              unsortedResult[docId] = document;
            }

            const score = calcTdIdf(
              termDocumentFrequency, statistics[docId], collectionSize, termCollectionFrequency,
            );
            console.dir({
              term,
              docId,
              termDocumentFrequency,
              documentSize: statistics[docId],
              collectionSize,
              termCollectionFrequency,
              score,
            });
            document.score += score;
          }
        }
      }

      console.dir({ query, unsortedResult });

      return Object
        .values(unsortedResult)
        .sort((a, b) => b.score - a.score)
        .map(({ id }) => id);
    },
  };
};

export default buildSearchEngine;

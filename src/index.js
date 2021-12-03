const toDocumentTerms = (collection) => collection.map(({ id, text }) => ({ id, terms: text.match(/\w+/g) ?? [] }));

const buildSearchEngine = (collection) => {
  const calcTdIdf = (termFrequency, documentSize, collectionSize, termCollectionSize) => (
    (termFrequency / documentSize) * Math.log2(collectionSize / termCollectionSize)
  );

  const size = collection.length;

  const documentTerms = toDocumentTerms(collection);
  /* eslint-disable no-param-reassign */
  const reverseIndex = documentTerms.reduce((acc, { id, terms }) => terms
    .reduce((accDocument, term) => {
      const list = accDocument[term] ?? {};
      accDocument[term] = { ...list, [id]: (list[id] ?? 0) + 1 };
      return accDocument;
    }, acc), {});

  const statistics = documentTerms.reduce(
    (acc, { id, terms }) => ({ ...acc, [id]: terms.length }),
    {},
  );

  return {
    search(words) {
      const lexer = {};

      const terms = words.match(/\w+/g);
      // eslint-disable-next-line no-restricted-syntax
      for (const term of terms) {
        const list = reverseIndex[term];
        const listSize = Object.keys(list).length;

        if (list) {
          // eslint-disable-next-line no-restricted-syntax
          for (const [docId, frequency] of Object.entries(list)) {
            let document = lexer[docId];
            if (!document) {
              document = { id: docId, score: 0 };
              lexer[docId] = document;
            }

            const score = calcTdIdf(frequency, statistics[docId], size, listSize);
            document.score += score;
          }
        }
      }

      return Object
        .values(lexer)
        .sort((a, b) => b.score - a.score)
        .map(({ id }) => id);
    },
  };
};

export default buildSearchEngine;

const buildSearchEngine = (documents) => {
  const index = documents.reduce((acc, document) => {
    const { id, text } = document;
    const words = text.match(/\w+/g) ?? [];
    /* eslint-disable no-param-reassign */
    return words.reduce((accWords, word) => {
      const records = accWords[word] ?? {};
      accWords[word] = {
        ...records,
        [id]: (records[id] ?? 0) + 1,
      };
      return accWords;
    }, acc);
  }, {});

  return {
    search(words) {
      const lexer = {};

      const terms = words.match(/\w+/g);
      // eslint-disable-next-line no-restricted-syntax
      for (const term of terms) {
        const stats = index[term];
        if (stats) {
          // eslint-disable-next-line no-restricted-syntax
          for (const [docId, count] of Object.entries(stats)) {
            let document = lexer[docId];
            if (!document) {
              document = { id: docId, entries: 0, total: 0 };
              lexer[docId] = document;
            }
            document.entries += 1;
            document.total += count;
          }
        }
      }

      return Object
        .values(lexer)
        .sort((a, b) => b.entries - a.entries || b.total - a.total)
        .map(({ id }) => id);
    },
  };
};

export default buildSearchEngine;

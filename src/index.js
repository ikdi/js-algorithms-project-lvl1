const buildSearchEngine = (documents) => {
  const unsortedIndex = documents.reduce((acc, document) => {
    const { id, text } = document;
    const words = text.match(/\w+/g) ?? [];
    /* eslint-disable no-param-reassign */
    return words.reduce((accWords, word) => {
      const records = accWords[word] ?? [];
      const record = records.find((item) => item.id === id);
      const count = (record?.count ?? 0) + 1;
      accWords[word] = records
        .filter((item) => item.id !== id)
        .concat({ id, count });

      return accWords;
    }, acc);
  }, {});

  const index = Object.entries(unsortedIndex)
    .reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value.sort((a, b) => b.count - a.count),
    }), {});

  return {
    search(word) {
      const [term] = word.match(/\w+/g);
      const items = index[term] ?? [];
      return items.map(({ id }) => id);
    },
  };
};

export default buildSearchEngine;

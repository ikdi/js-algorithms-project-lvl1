const buildSearchEngine = (documents) => {
  const index = documents.reduce((acc, document) => {
    const { id, text } = document;
    const words = text.match(/\w+/g) ?? [];
      // .split(' ')
      // .filter((word) => word.length > 0)
      // .map((word) => .test());
    
    console.log(id, words);

    return words.reduce((accWords, word) => {
      if (!accWords[word]) {
        accWords[word] = [id];
      } else if (!accWords[word].includes(id)) {
        accWords[word] = [...accWords[word], id];
      }

      return accWords;
    }, acc);
  }, {});

  return {
    search(word) {
      const [ term ] = word.match(/\w+/g);
      return index[term];    
    }
  }
};

const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
// const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
// const doc3 = { id: 'doc3', text: "I'm your shooter." };
// const docs = [doc1, doc2, doc3];
const docs = [ doc1 ];

const searchEngine = buildSearchEngine(docs); // поисковый движок запомнил документы

// поиск по документам
// const result = searchEngine.search('shoot');
const result = searchEngine.search('pint!');

console.log(result);
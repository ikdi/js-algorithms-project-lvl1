const buildSearchEngine = (documents) => {
  const index = documents.reduce((acc, document) => {
    const { id, text } = document;
    const words = text
      .split(/\W/)
      .filter((word) => word !== '');
    
    // console.log(id, words);

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
      return index[word];    
    }
  }
};

const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
const doc3 = { id: 'doc3', text: "I'm your shooter." };
const docs = [doc1, doc2, doc3];

const searchEngine = buildSearchEngine(docs); // поисковый движок запомнил документы

// поиск по документам
const result = searchEngine.search('shoot');

console.log(result);
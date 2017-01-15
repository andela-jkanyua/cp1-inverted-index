let index = require('../../src/inverted-index.js'),
  content = `[
            {
              "title": "Alice in Wonderland",
              "text": "Alice falls into a rabbit hole and enters a world full of imagination."
            },

            {
              "title": "The Lord of the Rings: The Fellowship of the Ring.",
              "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
            }
          ]`
          
let filename = 'books.json';

describe('Inverted Index', ()=>{
  var invertedIndex;

  describe('Read book data', ()=>{
    it('checks that json file is not empty', ()=> {
      expect(()=>{
        index.createIndex({}, filename);
      }).toThrow(new Error('the file is empty'));
    });

    it('checks that json file is valid', ()=> {
      expect(()=>{
        index.createIndex('Invalid', filename);
      }).toThrow(new Error('invalid json file'));
    });
  });

  describe('Populate Index', () =>{
    it('checks if index is created', ()=> {
      expect(index.createIndex(content, filename)).toBeDefined();
      expect(index.createIndex(content, filename)).not.toEqual({});
    });
    it('ensures index is correct', ()=>{
      let indices = index.createIndex(content, filename);
      expect(indices['books.json']['alice']).toEqual([0]);
      expect(indices['books.json']['of']).toEqual([0,1]);
    });
  });

  describe('Search Index', ()=> {
    it('checks search index returns correct result', ()=> {
      index.createIndex(content, filename);
      expect(index.searchIndex('books.json','alice')).toEqual({ 'books.json': { 'alice': [0]}}),
      expect(index.searchIndex('books.json', 'lord')).toEqual({ 'books.json': { 'lord': [1]}}),
      expect(index.searchIndex('books.json', 'of')).toEqual({ 'books.json': { 'of': [0,1]}})

    });
    it('ensures searchIndex can handle an array of search terms', ()=> {
      index.createIndex(content, filename);
      expect( ()=>{
        index.searchIndex('books.json', ['a', 'alice'], 'book', 'me', ['help', ['me', 'out']]);
      }).not.toThrow(new Error());
    });
    it('ensures searchIndex can handle a varied number of arguments', ()=> {
      index.createIndex(content, filename);
      expect(()=>{
        index.searchIndex('books.json', 'arg1');
        index.searchIndex('books.json', 'arg1', 'arg2');
        index.searchIndex('books.json', 'arg1', 'arg2', 'arg3');
      }).not.toThrow(new Error());
    });
  });
});


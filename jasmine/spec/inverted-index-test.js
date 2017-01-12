var index = require('../../src/inverted-index.js');

describe('Inverted Index', ()=>{
  var invertedIndex;

  describe('Read book data', ()=>{
    it('checks that json file is not empty', ()=> {
      expect(()=>{
        index.createIndex('uploads/empty.json');
      }).toThrow(new Error('the file is empty'));
    });

    it('checks that json file is valid', ()=> {
      expect(()=>{
        index.createIndex('uploads/invalid.json');
      }).toThrow(new Error('invalid json file'));
    });
  });

  describe('Populate Index', () =>{
    it('checks if index is created', ()=> {
      expect(index.createIndex('uploads/books.json')).toBeDefined();
      expect(index.createIndex('uploads/books.json')).not.toEqual({});
    });
    it('ensures index is correct', ()=>{
      let indices = index.createIndex('uploads/books.json');
      expect(indices['books.json']['alice']).toEqual([0]);
      expect(indices['books.json']['of']).toEqual([0,1]);
    });
  });

  describe('Search Index', ()=> {
    it('checks search index returns correct result', ()=> {
      index.createIndex('uploads/books.json');
      index.createIndex('uploads/morebooks.json')
      expect(index.searchIndex('books.json','alice')).toEqual({ 'books.json': { 'alice': [0]}})
      expect(index.searchIndex('books.json', 'lord')).toEqual({ 'books.json': { 'lord': [1]}}),
      expect(index.searchIndex('books.json', 'of')).toEqual({ 'books.json': { 'of': [0,1]}}),
      expect(index.searchIndex('morebooks.json', 'lord')).toEqual({ 'morebooks.json': { 'lord': [1]}})
    });
    it('ensures searchIndex can handle an array of search terms', ()=> {
      index.createIndex('uploads/books.json');
      expect( ()=>{
        index.searchIndex('books.json', ['a', 'alice'], 'book', 'me', ['help', ['me', 'out']]);
      }).not.toThrow(new Error());
    });
    it('ensures searchIndex can handle a varied number of arguments', ()=> {
      index.createIndex('uploads/books.json');
      expect(()=>{
        index.searchIndex('books.json', 'arg1');
        index.searchIndex('books.json', 'arg1', 'arg2');
        index.searchIndex('books.json', 'arg1', 'arg2', 'arg3');
      }).not.toThrow(new Error());
    });
  });
});


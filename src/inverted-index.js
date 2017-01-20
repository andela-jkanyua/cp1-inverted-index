// declare our dependencies
const entries = require('object.entries');

const natural = require('natural');

class Index {
  constructor() {
    this.invertedIndexObj = { };
    this.invertedIndex = { };
  }
  /**
    * Takes data from a json file an returns the JSON object
    * @param {string} filepath, {string} encoding
    * @returns {{}|*}
    */
  readJsonFile(content) {
    this.file = content;
    if (Object.keys(this.file).length === 0) {
      throw new Error('the file is empty');
    }
    try {
      this.jsonContent = JSON.parse(this.file);
    } catch (e) {
      throw new Error('Invalid json file');
    }
    for (let i = 0; i < this.jsonContent.length; i += 1) {
      if (!('title' in this.jsonContent[i] && 'text' in this.jsonContent[i])) {
        throw new Error('Bad JSON format');
      }
    }
    return this.jsonContent;
  }

  /**
    * Takes a json filename and creates an Inverted Index
    * @param {string} filename
    * @returns {{}|*}
    */
  createIndex(content, filename) {
    let term = [];
    this.invertedIndex = {};
    // get json file content assign to index
    const index = this.readJsonFile(content);
    for (let i = 0; i < index.length; i += 1) {
      term = index[i];
      let terms = `${term.title} ${term.text}`;
      // process text to remove repetition, special characters & (lower case)
      terms = this.processText(terms);
      for (let j = 0; j < terms.length; j += 1) {
        if (!(terms[j] in this.invertedIndex)) {
          this.invertedIndex[terms[j]] = [i];
        } else if (!(i in this.invertedIndex[terms[j]])) {
          this.invertedIndex[terms[j]].push(i);
        }
      }
    }
    // assign filename key the inverted index object
    this.invertedIndexObj[filename] = this.invertedIndex;
  }
  /**
    * Takes text and processes to lowercase, remove dublicates & other characters
    * @param {string} text
    * @returns text
    */
  processText(text) {
    const normalised = text.replace(/[.[,\]/#!$%^&*;:@{}=\-_`~()]/g, '').toLowerCase().split(' ');
    let normalisedText = new Set(normalised);
    normalisedText = Array.from(normalisedText);
    return normalisedText;
  }
  /**
   * Normalizes Data
   * @param {terms} a word to normalize.
   * @returns string  - normalized word.
   */
  search(term) {
    return natural.PorterStemmer.stem(term);
  }
  /**
   * Searches inverted index
   * @param {words} title - extended parameters.
   * @returns { } searchresults - Object of search results.
   */
  searchIndex(...words) {
    let file = [];
    this.searchResults = {};
    let termresults = {};

    let terms = words.toString().split(',').join(' ');
    terms = this.processText(terms);
    for (const [key, value] of entries(this.invertedIndexObj)) {
      termresults = {};
      for (const term of terms) {
        if (this.search(term) in value) {
          termresults[this.search(term)] = value[this.search(term)];
        } else if (term in value) {
          termresults[term] = value[term];
        }
      }
      if (Object.keys(termresults).length === 0 && termresults.constructor === Object) {
        termresults.Results = `No records found for: ${terms.toString().split(',').join(' ')}`;
      }
      this.searchResults[key] = termresults;
    }
    if (words[0] === undefined || words[0] === null) {
      return this.searchResults;
    } else if (words[0].toString().match(/^.*json$/)) {
      file = words[0].toString().match(/^.*json$/);
      if (file in this.searchResults) {
        const s = this.searchResults;
        this.searchResults = {};
        this.searchResults[file] = s[file];
      }
    }
    return this.searchResults;
  }

  /**
   * Returns Inverted index object.
   */
  getIndex() {
    return this.invertedIndexObj;
  }
}

// export values
exports.Index = Index;

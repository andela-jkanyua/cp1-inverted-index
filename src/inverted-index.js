// declare our dependencies
const entries = require('object.entries');
const natural = require('natural');

class Index {
  constructor() {
    this.invertedIndexObj = { };
    this.invertedIndex = { };
  }

 /**
  * Takes data from a JSON file an returns the JSON object
  * @param {string} content,
  * @returns {} the file content as JSON
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
  * Takes a JSON filename and creates an Inverted Index
  * @param {string} content - the JSON file content
  * @param {string} filename
  */
  createIndex(content, filename) {
    this.invertedIndex = {};
    // get json file content assign to index
    const index = this.readJsonFile(content);
    for (let i = 0; i < index.length; i += 1) {
      const term = index[i];
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
    // assign filename as the key & inverted index object as value
    this.invertedIndexObj[filename] = this.invertedIndex;
  }

  /**
  * Takes text and processes to lowercase, removes non-alphanumeric characters,
  * and removes dublicate words
  * @param {string} text
  * @returns array normalised Text
  */
  processText(text) {
    const normalised = text.replace(/[^a-z0-9 ]/gi, '').toLowerCase().split(' ');
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
    this.searchResults = {};
    let terms = words.toString().split(',').join(' ');
    terms = this.processText(terms);
    for (const [key, value] of entries(this.invertedIndexObj)) {
      // using const - no reassignment
      const termResults = {};
      for (const term of terms) {
        if (this.search(term) in value) {
          termResults[this.search(term)] = value[this.search(term)];
        } else if (term in value) {
          termResults[term] = value[term];
        }
      }
      if (Object.keys(termResults).length === 0 && termResults.constructor === Object) {
        termResults.Results = `No records found for: ${terms.toString().split(',').join(' ')}`;
      }
      this.searchResults[key] = termResults;
    }
    if (words[0] === undefined || words[0] === null) {
      return this.searchResults;
    } else if (words[0].toString().match(/^.*json$/)) {
      const file = words[0].toString().match(/^.*json$/);
      if (file in this.searchResults) {
        const tempResults = this.searchResults;
        this.searchResults = {};
        this.searchResults[file] = tempResults[file];
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

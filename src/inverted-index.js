
let fs = require('fs'),
	//stemmer = require('stemmer'),
	natural = require('natural');
	invertedIndexObj = {},
	invertedIndex = {},
	searchResults ={},
	index = [];

/**
  * Takes data from a json file an returns the JSON object
  * @param {string} filepath, {string} encoding
  * @returns {{}|*}
  */
let readJsonFileSync = (filePath, encoding='utf8')=>{
	var file;
	try{
		file = fs.readFileSync(filePath, encoding);
	}
	catch(e){
		throw new Error('No such file or directory');
	}
	if (file.trim().length === 0) {
		throw new Error('the file is empty');
	}
	try {
		return JSON.parse(file);
	} catch (e) {
		throw new Error('invalid json file')
	}
}





/**
  * Takes a json filename and creates an Inverted Index
  * @param {string} filename
  * @returns {{}|*}
  */
let createIndex =  (filename)=>{
	let term = [];
	invertedIndex = {};
	//get json file content assign to index
	let index = readJsonFileSync(filename);
	for(let i=0; i<index.length; i++){
		term = index[i];
		let terms = term.title + ' ' + term.text;
		//process text to remove repetition, special characters & (lower case)
		terms = processText(terms);
		for(let j = 0; j<terms.length; j++){
			if(!(terms[j] in invertedIndex))
			{
				invertedIndex[terms[j]] = [i];
			}
			else{
				if(!(i in invertedIndex[terms[j]]))
				{
					invertedIndex[terms[j]].push(i);
				}
			}
		}
	}
	//remove directory path
	filename = filename.split('/');
	//get filename
	filename = filename[filename.length-1];
	//assign filename key the inverted index object
	invertedIndexObj[filename] = invertedIndex;
	return invertedIndexObj
};
/**
  * Takes text and processes to lowercase, remove dublicates & other characters 
  * @param {string} text
  * @returns text
  */

let processText = (text)=>{
	let normalised = text.replace(/[.[,\]/#!$%\^&\*;:@{}=\-_`~()]/g, '').toLowerCase().split(' ');
	text = new Set(normalised);
	text = Array.from(text);
	return text;
}
/**
 * Searches inverted index
 * @param {words} title - extended parameters.
 * @returns { } searchresults - Object of search results.
 */

let search = (term)=>{
	return natural.PorterStemmer.stem(term)

}
let searchIndex = (...words)=>{
	let file = [],
		searchResults = {},
		termresults = {};

	terms = words.toString().split(',').join(' ');
	terms = processText(terms);
	for(let [key, value] of Object.entries(invertedIndexObj)){
		termresults = {};
		for (term of terms){ 
			if(term in value){
				termresults[term] = value[term];
			}
			else if(search(term) in value){
				termresults[search(term)] = value[search(term)];
			}
			searchResults[key] = termresults;
		}
	}
	if(words[0]===undefined | words[0]===null){
		return searchResults
	}
	else if(file = words[0].toString().match(/^.*json$/)){
		if(file in searchResults){
			let s = searchResults;
			searchResults = {};
			searchResults[file] = s[file];

		}
	}
	return searchResults
}
/**
 * Returns Inverted index object.
 */
let getIndex =  ()=>{
	return invertedIndexObj
}

//export values 
exports.createIndex = createIndex;
exports.getIndex = getIndex;
exports.searchIndex = searchIndex;
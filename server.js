// server.js

// set up ========================
const express = require('express');

const app = express(); // create our app w/ express

const morgan = require('morgan'); // log requests to the console (express4)

const bodyParser = require('body-parser'); // pull information from HTML POST (express4)

const indexFile = require('./src/inverted-index.js');

let content;

// Initialization
const index = new indexFile.Index();

// configuration =================;

app.use(express.static(`${__dirname}/public`));  // set the static files location /public/img will be /img for users
app.use(morgan('dev'));  // log every request to the console
app.use(bodyParser.urlencoded({ extended: 'true' }));    // parse application/x-www-form-urlencoded
app.use(bodyParser.json());  // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
// routes ======================================================================

// api ---------------------------------------------------------------------

// return created index

app.get('/api/createindex', (req, res) => {
  res.json(index.getIndex());
});

// get posted data and create index
app.post('/api/createindex', (req, res) => {
  content = new Buffer((req.body.data.split(',')[1]), 'base64').toString('utf8');
  // return JSON array of the created index
  try {
    res.json(index.createIndex(content, req.body.name));
  } catch (e) {
    return res.status(400).send({
      message: e.message,
    });
  }
});

// get posted data and search inverted index
app.post('/api/search', (req, res) => {
  try {
    res.json(index.searchIndex(req.body.file, req.body.searchTerms));
  } catch (e) {
    return res.status(400).send({
      message: e.message,
    });
  }
});

// load the single view file (angular will handle the page changes on the front-end)
app.get('*', (req, res) => {
  res.sendfile('./public/index.html');
});

// listen port 5000 on localhost(start app with node server.js) =======
app.listen(process.env.PORT || 5000);

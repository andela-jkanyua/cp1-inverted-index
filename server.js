// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                           // create our app w/ express
    var morgan = require('morgan');                     // log requests to the console (express4)
    var bodyParser = require('body-parser');            // pull information from HTML POST (express4)
    var index = require('./src/inverted-index.js');
    var fs = require('fs');

    // configuration =================;

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
// routes ======================================================================

    // api ---------------------------------------------------------------------

    //return created index
    app.get('/api/createindex', function(req, res) {
        res.json(index.getIndex());
    });

    //get posted data and create index
    app.post('/api/createindex', function(req, res){
        var content = new Buffer((req.body.data.split(',')[1]), 'base64').toString('utf8');
        //create file in uploads folder and copy JSON data to the file 
        fs.writeFile(`${__dirname}/uploads/${req.body.name}`, content, function (err) {
            if (err){
                throw err;
            }
            console.log('File saved!.');
            //return JSON array of the created index
            res.json(index.createIndex( `${__dirname}/uploads/${req.body.name}` ));
        });
        console.log( __dirname +'/uploads/' + req.body.name);
    });

    //get posted data and search inverted index
    app.post('/api/search', function(req,res){
        res.json(index.searchIndex(req.body.file, req.body.searchTerms));
    });

    // load the single view file (angular will handle the page changes on the front-end)
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); });

    // listen (start app with node server.js) ======================================
    app.listen(process.env.PORT || 5000);
    console.log('App listening on port 5000');

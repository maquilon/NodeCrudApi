// BASE SETUP
// =============================================================================
var mongoose = require('mongoose');
//mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
mongoose.connect('mongodb://localhost:27017/labels')

var Album = require('./app/models/album');

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// Middleware to use for all requests
// We can do validations to make sure that everything coming from a request is 
// safe and sound. We can throw errors here in case something is wrong. We can 
// do some extra logging for analytics or any statistics we'd like to keep.
router.use(function (req, res, next) {
    // do logging
    console.log('Request URL -->', req.method, req.url);
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
// router.get('/', function(req, res) {
//     res.json({ message: 'Welcome to our api!' });   
// });




// Routes for our API will happen here


// on routes that end in /albums
// ----------------------------------------------------
router.route('/albums')
    // get all the albums (accessed at GET http://localhost:8080/api/albums)
    .get(function (req, res) {
        Album.find(function (err, albums) {
            if (err)
                res.send(err);
            res.json(albums)
        });
    })



    // create a album (accessed at POST http://localhost:8080/api/albums
    .post(function (req, res) {
        var album = new Album();    // Create a new instance of the Album model
        album.labelName = req.body.labelName;
        album.year = req.body.year;

        // Save the album and check for errors
        album.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Album created!' })
        });
    });




// on routes that end in /albums/:album_id
// ----------------------------------------------------
router.route('/albums/:album_id')
    // get the album with that id (accessed at GET http://localhost:8080/api/albums/:album_id)
    .get(function (req, res) {
        Album.findById(req.params.album_id, function (err, album) {
            if (err)
                res.send(err);

            res.json(album)
        });
    })



    // delete the album with this id (accessed at DELETE http://localhost:8080/api/albums/:album_id)
    .delete(function (req, res) {
        Album.remove({
            _id: req.params.album_id
        }
            , function (err, album) {
                if (err)
                    res.send(err);

                res.json({ message: "Successfully deleted" })
            });
    })



    // update the album with this id (accessed at PUT http://localhost:8080/api/albums/:album_id)
    .put(function (req, res) {
        Album.findById(req.params.album_id, function (err, album) {
            if (err)
                res.send(err);

            album.labelName = req.body.labelName;  // Update the album info
            album.year = req.body.year;

            // Save the album
            album.save(function (err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Album updated!' })
            })
        })
    })


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('running --> localhost port ' + port);
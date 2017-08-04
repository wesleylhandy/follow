// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var router = express.Router();

var assert = require('assert');

var mongo = require('mongodb').MongoClient;
var shortid = require('shortid');

var uri = 'mongodb://' + process.env.MLAB_USER + ':' + process.env.MLAB_PASS + '@ds135983.mlab.com:35983/devserver';

app.use(express.static('public'));

mongo.connect(uri, function(err, db){
  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");
  var collection = db.collection('urls');



  // http://expressjs.com/en/starter/basic-routing.html
  router.get("/", function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
  });

  router.get("/new/:uri*", function (req, res) {
    var uri = decodeURIComponent(req.params.uri);
    var trailing = req.params[0];
    uri += trailing;

    var reg = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
    
    if(reg.test(uri)){
      
      collection.count({original_url: uri}, function(err, count) {
        assert.equal(null, err);
        if(count) {
          collection.find({original_url: uri}).toArray(function(err, doc){
            assert.equal(null, err);
            
            res.json({original_url: uri, short_url: 'https://follow.glitch.me/' + doc[0].short_url});
          })
        } else {
          var short_url = shortid.generate();
          collection.insert({original_url: uri, short_url: short_url}, function(err, doc) {
            assert.equal(null, err);
            res.json({original_url: uri, short_url: 'https://follow.glitch.me/' + short_url});
          })
        }
      })
   
      
    } else {
      
      res.statusCode = 400;
      res.json({error: 'Please try again with a valid URL.'});
    }
    
    
  });
  
  router.get('/:shortlink', function (req, res){
    var shortLink = req.params.shortlink;
    
    collection.find({short_url: shortLink}).toArray(function(err, doc){
      assert.equal(null, err);
      
      if(doc.length) {
        var url = doc[0].original_url;
        res.statusCode = 302;
        res.setHeader('location', url);
        res.end();
      } else {
        res.statusCode = 400;
        res.json({error: 'Please try again with a valid URL.'});
      }
     
    })
  })
  
  router.use("*", function(req, res) {
    res.statusCode = 404;
    res.json({error: 'Are you including the api call to the `/new` endpoint?'});
  })
  
  // Use the router routes in our application
  app.use('/', router);

  // listen for requests :)
  var listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
});
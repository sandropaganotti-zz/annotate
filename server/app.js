var express = require('express');
var app = module.exports = express();
var configure = require('./config/env');
var mongoose = require('mongoose');
var Primus = require('primus');
var Comment = require('./models/comment');

configure(app);

var server = require('http').createServer(app);
var primus = new Primus(server, {transformer: 'websockets'});

primus.use('rooms', require('primus-rooms'));
primus.use('hostname', require('./modules/primus-hostname'));
primus.on('connection', function(spark) {
  console.log('connected', spark.id, '@domain', spark.hostname);
  spark.join(spark.hostname);
});

primus.on('disconnection', function(spark) {
  console.log('disconnected', spark.id);
});

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get('/db', function(req, res) {
  res.status((mongoose.connection.readyState === 1) ? 200 : 503).send();
});

app.get(
  '/:domain/:reference/comments',
  require('./modules/request-from-right-domain'),
  function(req, res) {
    Comment.find(
      {domain: req.param('domain'), reference: req.param('reference')},
      function(err, comments) {
        if (err) {
          return res.status(500).send();
        }
        res.status(200).json(comments);
      }
    );
  }
);

app.post(
  '/:domain/:reference/comments',
  require('./modules/request-from-right-domain'),
  require('body-parser').json(),
  require('body-parser').urlencoded({extended: false}),
  function(req, res) {
    Comment.create(
      { domain: req.param('domain'),
        reference: req.param('reference'),
        author: req.body.author,
        text: req.body.text,
      },
      function(err, comment) {
        if (err) {
          if (err.name === 'ValidationError') {
            return res.status(400).json(err.errors);
          }
          return res.status(500).send();
        }
        res
          .status(201)
          .location(comment.location())
          .json(comment);
      }
    );
  }
);

Comment.on('created', function(comment) {
  primus.room(comment.domain).write({
    author: comment.author,
    text: comment.text,
  });
});

app.use(express.static(__dirname + '/../client'));

if (require.main === module) {
  mongoose.connect(app.get('db'), function() {
    server.listen(app.get('port'), function() {
      console.log('Listening on port %d', app.get('port'));
    });
  });
}

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

var ensureRequestComesFromRightDomain = function(req, res, next) {
  if (req.hostname === req.param('domain')) {
    return next();
  }
  if (req.hostname === '127.0.0.1') {
    return next();
  }
  res.send(403);
};

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get('/db', function(req, res) {
  res.send((mongoose.connection.readyState === 1) ? 200 : 503);
});

app.get('/:domain/:reference/comments', ensureRequestComesFromRightDomain, function(req, res) {
  Comment.find(
    {domain: req.param('domain'), reference: req.param('reference')},
    function(err, comments) {
      if (err) {
        return res.send(500);
      }
      res.status(200).json(comments);
    }
  );
});

app.post(
  '/:domain/:reference/comments',
  ensureRequestComesFromRightDomain,
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
          return res.send(500);
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

app.use(express.static(__dirname +
  (process.env.NODE_ENV === 'dist' ? '/../client-dist' : '/../client')
));


if (require.main === module) {
  mongoose.connect(app.get('db'), function() {
    server.listen(app.get('port'), function() {
      console.log('Listening on port %d', app.get('port'));
    });
  });
}

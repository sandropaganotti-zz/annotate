var express = require('express');
var app = module.exports = express();
var configure = require('./config/env');
var mongoose = require('mongoose');
var Comment = require('./models/comment');

configure(app);

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
  function(req, res) {
    Comment.create(
      { domain: req.param('domain'),
        reference: req.param('reference'),
        email: req.body.email,
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

app.use(express.static(__dirname +
  (process.env.NODE_ENV === 'dist' ? '/../client-dist' : '/../client')
));


if (require.main === module) {
  mongoose.connect(app.get('db'), function() {
    var server = app.listen(3000, function() {
      console.log('Listening on port %d', server.address().port);
    });
  });
}

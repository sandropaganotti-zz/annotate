var express = require('express');
var app = module.exports = express();
var configure = require('./config/env');
var mongoose = require('mongoose');

configure(app);

var server = require('http').createServer(app);

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get('/db', function(req, res) {
  res.status((mongoose.connection.readyState === 1) ? 200 : 503).send();
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

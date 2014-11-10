var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var environment = require('./config/env')();

app.set('port', environment.port);
app.set('db', environment.db);

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get('/db', function(req, res) {
  res.send((mongoose.connection.readyState === 1) ? 200 : 503);
});

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

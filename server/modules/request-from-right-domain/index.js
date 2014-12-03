var url = require('url');

module.exports = function(req, res, next) {
  var origin = req.hostname;
  if (req.headers.origin) {
    origin = url.parse(req.headers.origin).hostname;
  }
  if (origin === req.param('domain')) {
    return next();
  }
  if (req.hostname === '127.0.0.1') {
    return next();
  }
  res.status(403).send();
};

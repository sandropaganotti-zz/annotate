var url = require('url');

module.exports = {
  server: function(primus, options) {
    primus.on('connection', function(spark) {
      spark.hostname = url.parse(
        spark.request.headers.origin ||
        spark.request.headers.host
      ).hostname;
    });
  }
};

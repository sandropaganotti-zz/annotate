module.exports = {
  server: function(primus, options) {
    var url = require('url');
    primus.on('connection', function(spark) {
      spark.hostname = url.parse(
        spark.request.headers.origin ||
        spark.request.headers.host
      ).hostname;
    });
  }
};

module.exports = {
  server: function(primus, options) {
    primus.on('connection', function(spark) {
      spark.hostname = spark.request.headers.host.split(':')[0];
    });
  }
};

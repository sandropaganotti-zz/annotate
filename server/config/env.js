module.exports = function(app) {
  switch(process.env.NODE_ENV) {
    case 'test':
      app.set('db', 'mongodb://localhost/annotate-test');
      break;
    default:
      app.use(require('cors')());
      app.use(require('morgan')('combined'));
      app.set('port', process.env.PORT || 3000);
      app.set('db',
               process.env.MONGOLAB_URI ||
               process.env.MONGOHQ_URL ||
              'mongodb://localhost/annotate');
  }
};

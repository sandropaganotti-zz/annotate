/* jshint expr:true */

process.env.NODE_ENV = 'test';

var app = require('./../app');
var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose');

describe('server', function() {

  xit('is created', function() {
    expect(app).is.not.empty;
  });

  xit('is wired', function(done) {
    request(app).get('/').expect(200, 'Hello World', done);
  });

  xdescribe('mongodb', function() {

    before(function(done) {
      if (mongoose.connection.db) {
        return done();
      }
      mongoose.connect(app.get('db'), done);
    });

    xit('is connected', function(done) {
      request(app).get('/db').expect(200, done);
    });
  });
});

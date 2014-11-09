/* global describe:false, it:false, beforeEach:false */
/* jshint expr:true */

process.env.NODE_ENV = 'test';

var app = require('./../app');
var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose');

describe('server', function() {

  it('is created', function() {
    expect(app).to.exist;
  });

  it('is listening', function(done) {
    request(app).get('/').expect(200, 'Hello World', done);
  });

  describe('mongodb', function() {

    beforeEach(function(done) {
      mongoose.connect(app.get('db'), done);
    });

    it('is connected', function(done) {
      request(app).get('/db/collections').expect(200, done);
    });
  });
});

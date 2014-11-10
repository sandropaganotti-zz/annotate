/* global describe:false, it:false, before:false */
/* jshint expr:true */

process.env.NODE_ENV = 'test';

var app = require('./../app');
var Comment = require('./../models/comment');
var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose');
var clearDB = require('mocha-mongoose')(app.get('db'), {noClear: true});

describe('comment resource', function() {

  before(function(done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(app.get('db'), done);
  });

  before(function(done) {
    clearDB(done);
  });

  describe('GET /:domain/:resource/comments', function() {
    it('list all comments related to a :reference in a :domain', function(done) {
      Comment.create(
        {domain: 'example.com', reference: 42, email: 'gabriele.lana@example.com', text: '42'},
        function(err, comment) {
          expect(err).to.be.null;
          request(app).get('/example.com/42/comments')
            .expect('Content-Type', /json/)
            .expect(200, JSON.stringify([comment]))
            .end(done);
        }
      );
    });
  });
});

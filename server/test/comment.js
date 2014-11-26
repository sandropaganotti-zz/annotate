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
        {domain: 'example.com', reference: 42, author: 'gabriele.lana@example.com', text: '42'},
        function(err, comment) {
          expect(err).to.be.null;
          request(app).get('/example.com/42/comments')
            .expect('Content-Type', /json/)
            .expect(200, JSON.stringify([comment]))
            .end(done);
        }
      );
    });

    it('fails with 403 when request comes from wrong domain', function(done) {
      request(app).get('/example.com/42/comments')
        .set('Host', 'evil.com')
        .expect(403)
        .end(done);
    });
  });

  describe('POST /:domain/:resource/comments', function() {
    it('adds a comment to a :reference in a :domain', function(done) {
      request(app).post('/example.com/42/comments')
        .send({text: 'some text', author: 'gabriele.lana@example.com'})
        .expect(201)
        .expect('Content-Type', /json/)
        .expect('Location', /\/example.com\/42\/comments\/[0-9a-f]+/)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          Comment.findOne({_id: JSON.parse(res.text).id}, function(err, comment) {
            expect(err).to.be.null;
            expect(comment).to.be.an.instanceof(Comment);
            done();
          });
        });
    });

    it('fails with 400 when text is missing', function(done) {
      request(app).post('/example.com/42/comments')
        .send({author: 'gabriele.lana@example.com'})
        .expect(400)
        .end(done);
    });

    it('fails with 403 when request comes from wrong domain', function(done) {
      request(app).post('/example.com/42/comments')
        .send({text: 'some text', author: 'gabriele.lana@example.com'})
        .set('Host', 'evil.com')
        .expect(403)
        .end(done);
    });
  });
});

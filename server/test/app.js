process.env.NODE_ENV = 'test';

var app = require('./../app');
var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose');
var File = require('../models/file');
var clearDB  = require('mocha-mongoose')(app.get('db'));

describe('remoteStorage basic behavior', function(){

  it('app is created', function(){
    expect(app).to.exist;
  });

  it('answers 200 on its root endpoint', function(done){
    request(app).get('/').expect(200, done);
  });

  describe('the file REST APIs', function(){

    beforeEach(function(done){
      if(mongoose.connection.db){
        return done();
      }
      mongoose.connect(app.get('db'), done);
    });

    it('return a test file on /api/files', function(done){
      File.create({name: 'vacanze-mare.jpg'}, function(){
        request(app).get('/api/files').expect(function(res){
          expect(res.body[0].name).to.be.equal('vacanze-mare.jpg');
        }).end(done);
      });
    });

  })

});

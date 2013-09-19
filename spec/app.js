var request = require('supertest');
var express = require('express');
var assert = require('assert');
var should = require('should');
var config = require('../config/config');
var passport = require('passport');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myapp');

var model = require('../app/models/user.js');
require('../lib/security').Security(passport, model.User);

var app = express();
app.use(passport.initialize());
require('../config/routes').addRoutes(app, config, passport);

describe('Node API Server', function() {
  it('Should 404 /', function(done) {
    request(app)
      .get('/')
      .expect(404, done);
  });
  it('Should get "{hello:world}"', function(done) {
    request(app)
      .get('/hello.json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        res.body.should.have.property('hello', 'world');
        done();
      });
  });
  it('Should get "Unauthorized"', function(done) {
    request(app)
      .get('/authorized.json')
      .expect(401)
      .end(function(err,res) {
        res.text.should.equal('Unauthorized');
        done();
      });
  });
  it('Should login', function(done) {
    request(app)
      .post('/login')
      .send({
        username: 'test',
        password: 'secret'
      })
      .expect(200)
      .end(function(err,res) {
        res.text.should.equal('Unauthorized');
        done();
      });
  });
});

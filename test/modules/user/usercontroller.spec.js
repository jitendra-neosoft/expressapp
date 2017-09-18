'use strict';

var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../../../server');

describe('/Get all users', function() {
  this.timeout(25000);
  it('it should have user data', function(done){
    request(app)
    .get('/allusers')
    .send({'itemsperpage':5,'page':1})
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res.body.data).to.be.an('array')
      done();
    });
  });
});
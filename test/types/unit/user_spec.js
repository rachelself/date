/* global before, describe, it, beforeEach */
/* jshint expr: true */

'use strict';

process.env.DBNAME = 'dating-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');


var User;
var sue;

describe('User', function(){
  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      factory('user', function(users){
        done();
      });
    });
  });

  describe('.create', function(){
    it('should successfully create a user', function(done){
      var obj = {email: 'marisa@marisa.com', password: '1234'};
      User.create(obj, function(u){
        expect(u).to.be.ok;
        expect(u).to.be.an.instanceof(User);
        expect(u.password).to.have.length(60);
        expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(u.virtues).to.have.length(0);
        done();
      });
    });


    it('should NOT successfully create a user', function(done){
      var obj = {email: 'sue@sue.com', password: '1234'};
      User.create(obj, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

  describe('.login', function(){
    it('should login a user', function(done){
      User.login({email: 'sue@sue.com', password:'1234'}, function(u){
        expect(u).to.be.ok;
        done();
      });
    });

    it('should NOT login user - bad email', function(done){
      User.login({email: 'wrong@email.com', password:'1234'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });

    it('should NOT login user - bad password', function(done){
      User.login({email: 'sue@sue.com', password:'wrong'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });

  });

  describe('.findByUserId', function(){
    it('should return correct user object', function(done){
      User.findByUserId(sue._id.toString(), function(user){
        expect(user).to.be.instanceof(User);
        expect(user.email).to.equal(sue.email);
        expect(user._id).to.deep.equal(sue._id);
        done();
      });
    });

    it('should return null for bad userId', function(done){
      User.findByUserId('wrong', function(user){
        expect(user).to.be.null;
        done();
      });
    });



  });

});

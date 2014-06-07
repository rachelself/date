/* global before, describe, it, beforeEach */
/* jshint expr: true */

'use strict';

process.env.DBNAME = 'dating-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');


var Meeting;
var User;
var id = Mongo.ObjectID('473910437284938102384736');
var d1 = {'day': '2014-06-09', 'time': '04:13', 'location': {'name': 'red robin'}, 'inviteeId': '473910437284938102384796', 'availability': 'Im available whenever', '_id': '473910437284938102384943'};
var d2 = {'day': '2014-07-01', 'time': '07:00', 'location': {'name': 'J Alexanders'}, 'inviteeId': '473910437284938102384796', 'availability': 'Im available whenever', '_id': '473910437284938102384957'};

describe('Meeting', function(){
  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      Meeting = traceur.require(__dirname + '/../../../app/models/meeting.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('meetings').drop(function(){
      global.nss.db.collection('users').drop(function(){
        factory('user', function(users){
          Meeting.create(id, d1, function(){
            Meeting.create(id, d2, function(){
              done();
            });
          });
        });
      });
    });
  });

  describe('.create', function(){
    it('should successfully create a meeting', function(done){
      var obj = {'day': '2014-07-09', 'time': '08:00', 'location': {'name': 'red robin'}, 'inviteeId': '473910437284938102384796', 'availability': 'Im a serial killer', '_id': '473910437284938102384987'};
      Meeting.create(id, obj, function(m){
        expect(m).to.be.ok;
        expect(m).to.be.an.instanceof(Meeting);
        expect(m._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(m.when).to.be.an.instanceof(Date);
        expect(m.location).to.be.an('object');
        expect(m.inviteeId.toString()).to.equal('473910437284938102384796');
        expect(m.availability).to.equal('Im a serial killer');
        done();
      });
    });


    it('should NOT successfully create a meeting - bad inviteeId', function(done){
      var day = {'day': '2014-07-01', 'time': '07:00', 'location': {'name': 'J Alexanders'}, 'inviteeId': '473910437284938102384700', 'availability': 'Im available whenever', '_id': '473910437284938102384957'};
      Meeting.create(id, day, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should return correct meeting object', function(done){
      Meeting.findById('473910437284938102384943', function(m){
        expect(m).to.be.instanceof(Meeting);
        expect(m.availability).to.equal('Im available whenever');
        done();
      });
    });

    it('should return null for bad Id', function(done){
      Meeting.findById('wrong', function(m){
        expect(m).to.be.null;
        done();
      });
    });

    it('should return null for null', function(done){
      Meeting.findById(null, function(m){
        expect(m).to.be.null;
        done();
      });
    });
  });

});

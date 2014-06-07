'use strict';

var meetings = global.nss.db.collection('meetings');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var User = traceur.require(__dirname + '/user.js');

class Meeting {

  save(fn){
    meetings.save(this, ()=>fn());
  }

  static create(userId, obj, fn){
    User.findById(obj.inviteeId, user=>{
      if(user){
        var meeting = new Meeting();
        meeting._id = Mongo.ObjectID(obj._id);
        meeting.when = new Date(`${obj.day} ${obj.time}`);
        meeting.location = obj.location;
        meeting.creatorId = userId;
        meeting.inviteeId = obj.inviteeId;
        meeting.availability = obj.availability;
        meeting.isConfirmed = false;
        meeting.isComplete = false;
        meetings.save(meeting, ()=>fn(meeting));
      } else {
        fn(null);
      }
    });
  }

  static findById(id, fn){
    Base.findById(id, meetings, Meeting, fn);
  }

  static findAll(id, fn){
    Base.findAll(id, meetings, Meeting, fn);
  }

}

module.exports = Meeting;

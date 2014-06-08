'use strict';

var meetings = global.nss.db.collection('meetings');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var User = traceur.require(__dirname + '/user.js');
var _ = require('lodash');

class Meeting {

  save(fn){
    meetings.save(this, ()=>fn());
  }

  static create(userId, obj, location, fn){
    User.findById(obj.inviteeId, user=>{
      if(user){
        var meeting = new Meeting();
        meeting._id = Mongo.ObjectID(obj._id);
        meeting.when = new Date(`${obj.day} ${obj.time}`);
        meeting.location = location;
        meeting.creatorId = Mongo.ObjectID(userId);
        meeting.inviteeId = Mongo.ObjectID(obj.inviteeId);
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

  static findByInviteeId(id, fn){
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
      id = Mongo.ObjectID(id);
    }

    if(!(id instanceof Mongo.ObjectID)){fn(null); return;}

    meetings.find({inviteeId:id}).toArray((e,records)=>{
      records = records.map(r=>_.create(Meeting.prototype, r));
      fn(records);
    });
  }


  static findByCreatorId(id, fn){
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
      id = Mongo.ObjectID(id);
    }

    if(!(id instanceof Mongo.ObjectID)){fn(null); return;}

    meetings.find({creatorId:id}).toArray((e,records)=>{
      records = records.map(r=>_.create(Meeting.prototype, r));
      fn(records);
    });
  }
}

module.exports = Meeting;

'use strict';

var meetings = global.nss.db.collection('meetings');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var User = traceur.require(__dirname + '/user.js');
var _ = require('lodash');
var moment = require('moment');
// var async = require('async');

class Meeting {

  update(obj, location) {
    console.log(obj.day);
    console.log(obj.time);
    var creator = this.creatorId;
    var invitee = this.inviteeId;
    this.inviteeId = creator;
    this.creatorId = invitee;
    this.day = new Date(`${obj.day} ${obj.time} GMT-0500 (CDT)`);
    this.location = location;
    this.availability = obj.availability;
    this.isConfirmed = false;
    this.isComplete = false;
  }

  confirm() {
    this.isConfirmed = true;
  }

  save(fn) {
    meetings.save(this, ()=>fn());
  }

  static RemoveById(id, fn) {
    id = Mongo.ObjectID(id);
    meetings.findAndRemove({_id:id}, ()=>fn());
  }

  static create(userId, obj, location, fn){
    User.findById(obj.inviteeId, user=>{
      if(user){
        var meeting = new Meeting();
        meeting._id = Mongo.ObjectID(obj._id);
        meeting.day = new Date(`${obj.day} ${obj.time} GMT-0500 (CDT)`);
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

  static readyDateInvites(dates, fn){
    var newDates = [];
    dates.forEach(date=>{
      User.findById(date.creatorId, creator=>{
        if(creator.photos.length){
          creator.photos.forEach(p=>{
            if(p.isPrimary){
              date.creatorPhoto = p.path;
              date.day = moment(date.day).format('MMM Do YYYY, h:mm a');
              newDates.push(date);
              if(newDates.length === dates.length){
                fn(newDates);
              }
            }
          });
        } else {
          date.creatorPhoto = `/img/${creator.gender}.png`;
          date.day = moment(date.day).format('MMM Do YYYY, h:mm a');
          newDates.push(date);
          if(newDates.length === dates.length){
            fn(newDates);
          }
        }
      });
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

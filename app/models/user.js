/*jshint unused:false*/

'use strict';

var bcrypt = require('bcrypt');
var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var mkdirp = require('mkdirp');
var fs = require('fs');
var _ = require('lodash');

class User {

  save(fn){
    users.save(this, ()=>fn());
  }

  addSuitor(id){
    if(!(_.contains(this.suitors, id))){
      this.suitors.push(id);
    }
  }

  update(obj){
    this.location = obj.location;
    this.interests = obj.interests;
    this.values = obj.values;
    this.bio = obj.bio;
  }

  addPhotos(photos){
    photos.forEach((p,i)=>{
      var photo = {};
      photo.fileName = p.originalFilename;
      photo.path = `/img/${this._id}/${photo.fileName}`;
      if(i){
        photo.isPrimary = false;
      } else {
        photo.isPrimary = true;
      }
      photo.blurb = '';
      this.photos.push(photo);
      mkdirp(`${__dirname}/../static/img/${this._id}/`);
      fs.renameSync(p.path, __dirname+'/../static/img/'+ this._id + '/' + photo.fileName);
    });
  }

  updatePhotos(photos){
    this.photos = [];
    photos.fileName.forEach((p,i)=>{
      var photo = {};
      photo.fileName = photos.fileName[i];
      photo.path = photos.path[i];
      if(i === (photos.primary * 1)){
        photo.isPrimary = true;
      } else {
        photo.isPrimary = false;
      }
      photo.blurb = photos.blurb[i];
      this.photos.push(photo);
    });
  }

  static getSuitors(user){
    var id = user._id.toString();
    users.find({suitors: id}).toArray((err, records)=>{
      console.log('=======================records');
      console.log(records);
    });
  }

  static create(obj, fn){
    users.findOne({email:obj.email}, (err,user)=>{
      if(user) {
        fn(null);
      } else {
        user = new User();
        user._id = Mongo.ObjectID(obj._id);
        user.email = obj.email;
        user.password = bcrypt.hashSync(obj.password, 8);
        user.firstName = obj.firstName;
        user.lastName = obj.lastName;
        user.gender = obj.gender;
        user.location = obj.location;
        user.lookingFor = obj.lookingFor;
        user.age = obj.age;
        user.interests = [];
        user.values = [];
        user.bio ='';
        user.suitors = [];
        user.blockedUsers = [];
        user.hasBadge = false;
        user.photos = [];
        users.save(user, ()=>fn(user));
      }
    });
  }

  static login(obj, fn){
    users.findOne({email:obj.email}, (e,u)=>{
      if(u){
        var isMatch = bcrypt.compareSync(obj.password, u.password);
        if(isMatch){
          fn(u);
        }else{
          fn(null);
        }
      }else{
        fn(null);
      }
    });
  }

  static findById(id, fn){
    Base.findById(id, users, User, fn);
  }

  static findAll(fn){
    Base.findAll(users, User, fn);
  }

}

module.exports = User;

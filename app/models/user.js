'use strict';

var bcrypt = require('bcrypt');
var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class User {

  save(fn){
    users.save(this, ()=>fn());
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

  static findAll(id, fn){
    Base.findAll(id, users, User, fn);
  }

}

module.exports = User;

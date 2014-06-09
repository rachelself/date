'use strict';

// var locations = global.nss.db.collection('locations');


class Location {
  constructor(obj){
    this.name = obj.name;
    this.address1 = obj.address1;
    this.city = obj.city;
    this.state = obj.state;
    this.zip = obj.zip;
    this.phone = obj.phone;
    this.url = obj.url;
    this.lat = obj.lat;
    this.lng = obj.lng;
    this.ratingImg = obj.ratingImg;
    this.rating = obj.rating;
  }

}

module.exports = Location;

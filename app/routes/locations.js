'use strict';


var traceur = require('traceur');
var Location = traceur.require(__dirname + '/../../app/models/location.js');



exports.create = (req, res)=>{
  var location = new Location(req.body);
  res.send(location);
};

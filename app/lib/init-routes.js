'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var dates = traceur.require(__dirname + '/../routes/dates.js');
  var locations = traceur.require(__dirname + '/../routes/locations.js');

  app.all('*', users.lookup);

  app.get('/', dbg, home.index);

  app.get('/users', dbg, users.index);
  app.post('/users/update', dbg, users.update);
  app.post('/users/photos', dbg, users.addPhotos);
  app.post('/users/login', dbg, users.login);
  app.post('/users', dbg, users.create);
  app.get('/users/search', dbg, users.search);
  app.get('/logout', dbg, users.logout);
  app.get('/users/editProfile', dbg, users.edit);
  app.get('/users/editPhotos', dbg, users.editPhotos);
  app.get('/users/:id', dbg, users.profile);

  app.get('/dates', dbg, dates.index);
  app.get('/dates/new', dbg, dates.new);
  app.post('/dates', dbg, dates.create);
  app.get('/dates/:id/edit', dbg, dates.edit);
  app.get('/dates/:id', dbg, dates.show);
  app.post('/dates/destroy/:id', dbg, dates.destroy);
  app.post('/dates/update/:id', dbg, dates.update);
  app.post('/dates/:id', dbg, dates.confirm);


  app.post('/locations', dbg, locations.create);

  console.log('Routes Loaded');
  fn();
}

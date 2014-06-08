'use strict';

// app.post('/users/login', dbg, users.login);
// app.get('/users/profile', dbg, users.profile);
// app.get('/users/dates', dbg, users.dates);
// app.get('/users/search', dbg, users.search);

var multiparty = require('multiparty');
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../../app/models/user.js');
var Meeting = traceur.require(__dirname + '/../../app/models/meeting.js');


exports.index = (req, res)=>{
  if(req.session.userId){
    res.redirect(`users/${req.session.userId}`);
  } else {
    res.redirect('/');
  }
};

exports.create = (req, res)=>{
  User.create(req.body, u=>{
    res.locals.user = u;
    req.session.userId = u._id;
    res.redirect(`users/${u._id}`);
  });
};

exports.login = (req, res)=>{
  User.login(req.body, u=>{
    res.locals.user = u;
    req.session.userId = u._id;
    res.redirect(`/users/${req.session.userId}`);
  });
};

exports.profile = (req, res)=>{
  if(req.params.id === req.session.userId){
    res.render('users/profile');
  } else {
    User.findById(req.params.id, profile=>{
      res.render('users/profile', {profile:profile});
    });
  }
};

exports.edit = (req, res)=>{
  res.render('users/editProfile');
};

exports.update = (req, res)=>{
  var user = res.locals.user;
  user.update(req.body);
  user.save(()=>{
    res.redirect(`/users/${req.session.userId}`);
  });
};

exports.dates = (req, res)=>{
  Meeting.findByInviteeId(req.session.userId, inviteeDates=>{
    Meeting.findByCreatorId(req.session.userId, creatorDates=>{
      res.render('users/dates', {dateInvites: inviteeDates, datesCreated: creatorDates});
    });
  });
};

exports.editPhotos = (req, res)=>{
  res.render('users/editPhotos');
};

exports.addPhotos = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    var user = res.locals.user;
    user.addPhotos(files.photos);
    user.save(()=>{
      res.redirect('/users/editPhotos');
    });
  });
};

exports.updatePhotos = (req, res)=>{
  var user = res.locals.user;
  user.updatePhotos(req.body);
  user.save(()=>{
    res.redirect('/users/editProfile');
  });
};

exports.suitors = (req, res)=>{
  User.findById(req.body.userId, u=>{
    u.addSuitor(req.session.userId);
    u.save(()=>{
      res.redirect(`/users/${req.body.userId}`);
    });
  });
};

exports.search = (req, res)=>{
  User.findAll(records=>{
    res.render('users/search', {users: records});
  });
};

exports.lookup = (req, res, next)=>{
  User.findById(req.session.userId, u=>{
    res.locals.user = u;
    next();
  });
};

exports.logout = (req, res)=>{
  req.session.userId = null;
  res.redirect('/');
};

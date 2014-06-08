'use strict';

// app.get('/dates/new', dbg, dates.new);
// app.post('/dates', dbg, dates.create);
// app.get('/dates/:id', dbg, dates.show);
// app.put('/dates/:id', dbg, dates.confirm);
// app.delete('/dates/:id', dbg, dates.destroy);
// app.get('/dates/:id/edit', dbg, dates.edit);
// app.put('/dates/:id', dbg, dates.modify);

var traceur = require('traceur');
var Location = traceur.require(__dirname + '/../../app/models/location.js');
var Meeting = traceur.require(__dirname + '/../../app/models/meeting.js');

exports.new = (req, res)=>{
  res.render('dates/new');
};

exports.create = (req, res)=>{
  var userId = res.locals.user._id;
  var location = new Location(req.body);
  Meeting.create(userId, req.body, location, meeting=>{
    res.send(meeting);
  });
};

exports.index = (req, res)=>{
  Meeting.findByInviteeId(req.session.userId, inviteeDates=>{
    Meeting.findByCreatorId(req.session.userId, creatorDates=>{
      res.render('dates/index', {dateInvites: inviteeDates, datesCreated: creatorDates});
    });
  });
};

exports.show = (req, res)=>{
  Meeting.findById(req.params.id, meeting=>{
    res.render('dates/show', {meeting:meeting});
  });
};

exports.confirm = (req, res)=>{

};

exports.destroy = (req, res)=>{

};

exports.edit = (req, res)=>{
  res.render('dates/edit');
};

exports.update = (req, res)=>{

};

'use strict';

// app.get('/dates/new', dbg, dates.new);
// app.post('/dates', dbg, dates.create);
// app.get('/dates/:id', dbg, dates.show);
// app.put('/dates/:id', dbg, dates.confirm);
// app.delete('/dates/:id', dbg, dates.destroy);
// app.get('/dates/:id/edit', dbg, dates.edit);
// app.put('/dates/:id', dbg, dates.modify);

var traceur = require('traceur');
var moment = require('moment');
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
  Meeting.findById(req.params.id, meeting=>{
    meeting.confirm();
    meeting.save(()=>{
      res.redirect('/dates');
    });
  });
};

exports.destroy = (req, res)=>{
  Meeting.RemoveById(req.params.id, ()=>{
    res.redirect('/dates');
  });
};

exports.edit = (req, res)=>{
  Meeting.findById(req.params.id, meeting=>{
    var day = moment(meeting.day).format('YYYY-MM-DD');
    res.render('dates/edit', {meeting:meeting, day:day});
  });
};

exports.update = (req, res)=>{
  var location = new Location(req.body);
  Meeting.findById(req.params.id, meeting=>{
    meeting.update(req.body, location);
    meeting.save(()=>{
      res.send(meeting);
    });
  });
};

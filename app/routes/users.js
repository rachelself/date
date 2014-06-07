'use strict';

// app.post('/users/login', dbg, users.login);
// app.get('/users/profile', dbg, users.profile);
// app.get('/users/dates', dbg, users.dates);
// app.get('/users/search', dbg, users.search);

exports.login = (req, res)=>{
  res.redirect('users/profile');
};

exports.profile = (req, res)=>{
  res.render('users/profile');
};

exports.dates = (req, res)=>{
  res.render('users/dates');
};

exports.search = (req, res)=>{
  res.render('users/search');
};

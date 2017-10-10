'use strict';

var express = require("express"),
    expressJwt = require('express-jwt'),
    jwt = require('jsonwebtoken'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    moment = require('moment-timezone'),
    util = require('util'),
    app = express(),
    itLocale = require('./locales/it_IT.json'),
    deLocale = require('./locales/de.json'),
    log = require('./logger'),
    data = require('./data'),
    LOCALES = {
      'de': deLocale,
      'it': itLocale
    },
    EXPIRATION_MINS = (process.env.OPT_EXP_MINS ? parseInt(process.env.OPT_EXP_MINS, 10) : 60 * 4),
    SECRET = process.env.OPT_SECRET || data.secret(),
    PORT = (process.env.OPT_PORT ? parseInt(process.env.OPT_PORT, 10) : 8000);

/**
 * Generates a random true or false value according to a certain probability.
 *
 * @param n The numerator, if none is specified, result has 50% probability to be true.
 * @param d The denominator, if none is specified, result has 50% probability to be true.
 * @returns {boolean}
 */
function trueOrFalse(n, d) {
  if (n !== undefined && d !== undefined) {
    return _.random(1, d) <= n;
  }
  return _.random(1) === 1;
}

/**
 * Extracts the JWT token from the 'Authorization' header.
 * Header is expected in the form
 *      'Bearer ' <token>
 * where <token> is to be replaced with the JWT token.
 * Note that there's exactly one space between Bearer and token.
 */
function getToken(req) {
  var auth = req.headers.authorization;

  if (auth && auth.split(' ')[0] === 'Bearer') {

    return auth.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

/**
 * Called for every request, checks if error is an authentication error.
 * In such case, replies with a 401 code and an JSON message.
 */
function onAuthenticationError(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    log.warn('Attempting to call service with invalid authentication token', req.path);
    res.json(401, {message: 'Invalid authentication token'});
  }
}

function isRevoked(req, payload, done) {
  return done(null, data.isRevoked(payload.username));
}

app.configure(function() {
  // configures the view directory
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  // protects APIs with JWT
  app.use('/rest/', expressJwt({
    secret: SECRET,
    getToken: getToken,
    isRevoked: isRevoked
  }).unless({path: ['/rest/login', '/rest/profile/i18n', '/legacy/*']}));

  app.use(express.favicon());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);

  // serves static content if necessary
  app.use(express.static(path.join(__dirname, 'public')));
  log.info("Serving static content from " + path.join(__dirname, 'public'));

  // manage authentication errors
  app.use(onAuthenticationError);
});

/**
 * Retrieves localization data.
 * These include translation in the user language as well as formatting options for dates and times.
 *
 * @url /rest/profile/i18n
 */
app.get('/rest/profile/i18n', function(req, res) {
  if (!req.acceptedLanguages || req.acceptedLanguages.length === 0) {
    log.debug('No accepted language passed!');
    res.json({});
    return;
  }
  var raw = req.acceptedLanguages[0].toLowerCase(),
      i = raw.indexOf('-'),
      lang = i >= 0 ? raw.substr(0, i) : raw,
      country = i >= 0 ? raw.substr(i + 1) : null,
      locale;

  log.debug("Retrieving I18N", {header: req.acceptedLanguages, raw: raw, lang: lang, country: country});

  locale = LOCALES[raw] !== undefined ? LOCALES[raw] : LOCALES[lang] !== undefined ? LOCALES[lang] : null;
  if (locale) {
    res.json({
      language: lang,
      translations: locale.translations,
      formats: locale.formats,
      type: 'BILING',
      available: ['de', 'it']
    });
  } else {
    res.json({language: 'default', translations: {}, formats: {}});
  }
});

/**
 * Logs user into the server.
 *
 * @url /rest/login
 * @body { username: "", password: "" }
 */
app.post('/rest/login', function(req, res) {
  var usr = req.body.username,
      pwd = req.body.password,
      profile,
      token;

  log.debug('Logging in user', {username: usr, password: 'xxxxxxxx'});

  profile = data.authenticate(usr, pwd);
  if (profile) {
    token = jwt.sign(profile, SECRET, {expiresIn: EXPIRATION_MINS * 60});
    data.storeToken(usr, token);
    res.json({token: token});
  } else {
    log.warn('Attempt to login with wrong credentials', {username: usr, password: pwd});
    res.json(401, {message: 'Invalid username or password'});
  }
});

/**
 * Logs user out of the server.
 *
 * @url /rest/logout
 */
app.post('/rest/logout', function(req, res) {
  log.debug('Logging out user', {email: req.user.email, username: req.user.username});
  if (req.user && req.user.username)
    data.revokeToken(req.user.username);
  res.json({result: 0});
});

/**
 * Changes current user's password.
 *
 * @url /rest/account/password
 */
app.put('/rest/account/password', function(req, res) {
  var currentPassword = req.body.currentPassword,
      newPassword = req.body.newPassword,
      user = req.user.username,
      profile = data.authenticate(user, currentPassword);

  log.debug('Changing user password by id', req.user.username);

  setTimeout(function() {
    if (!profile) {
      res.json(400, {message: 'Current password is wrong'});
    } else if (currentPassword == newPassword) {
      res.json(400, {message: 'New password is equal to previous'});
    }
    else if (trueOrFalse(3, 4)) {
      log.debug('Sending error message when changing password', {user: req.user.username});
      res.json(400, {message: 'Change password error'});
    } else {
      res.json({message: 'OK'});
    }
  }, _.random(200, 1000));
});

app.get('/rest/account/permissions', function(req, res) {
  var user = req.user.username;
  log.debug('Retrieving permissions for user', req.user.username);
  setTimeout(function() {
    res.json(data.permissions(user));
  }, _.random(200, 1000));
});

app.get('/rest/heroes', function(req, res) {
  var hh = data.heroes(),
      unauth = trueOrFalse(1, 5);
  log.debug('Looking up heroes', {unauthorized: unauth});
  setTimeout(function() {
    if (unauth) {
      res.json(401, {message: 'Invalid username or password'});
    } else {
      res.json({ results: hh, total: 100 });
    }
  }, _.random(200, 1000));
});

app.get('/rest/menu', function(req, res) {
  var user = req.user.username;
  log.debug('Retrieving menus for user', req.user.username);
  setTimeout(function() {
    res.json(data.menu());
  }, _.random(200, 1000));
});

app.get('/gzoom/control/box', function(req, res) {
  const id = req.query.menuId;
  const exid = req.query.externalLoginKey;
  log.debug('Retrieving legacy content with id: ' + id);
  res.render('index', {
    title: 'Legacy Content ' + id,
    message: 'Menu ' + id,
    info: 'Ext. Login Key: ' + exid
  });
});

/**
/rest/uom/value
/rest/uom/type
/rest/uom/scales*/
app.get('/rest/uom/type', function(req, res) {
  var uomTypes = data.uomTypes();
  log.debug('Looking up uomTypes ' + uomTypes);
  setTimeout(function() {
    res.json({ results: uomTypes, total: uomTypes.length });
  }, _.random(200, 1000));
});

app.post('/rest/uom/type', function(req, res) {
  let uomTypeId = req.body.uomTypeId;
  let description = req.body.description;
  let uomType = {uomTypeId: uomTypeId, description: description};
  log.debug('Create uomType');
  let index = data.createUomType(uomType);
  setTimeout(function() {
    res.json({ uomTypeId: uomTypeId });
  }, _.random(200, 1000));
});

app.put('/rest/uom/type/:id', function(req, res) {
  const id = req.param('id');
  const uomTypeId = req.body.uomTypeId;
  const description = req.body.description;
  const uomType = {uomTypeId: uomTypeId, description: description};
  log.debug('Update uomType ' + id);
  const index = data.updateUomType(id, uomType);
  setTimeout(function() {
    res.json({ uomTypeId: uomTypeId });
  }, _.random(200, 1000));
});

app.delete('/rest/uom/type/:id', function(req, res) {
  const id = req.param('id');
  log.debug('Delete uomType ' + id);
  const index = data.deleteUomType(id);
  setTimeout(function() {
    res.json({ uomTypeId: id });
  }, _.random(200, 1000));
});

app.get('/rest/uom/value', function(req, res) {
  var uoms = data.uoms();
  log.debug('Looking up uoms');
  setTimeout(function() {
    res.json({ results: uoms, total: uoms.length });
  }, _.random(200, 1000));
});

app.get('/rest/uom/value/:id', function(req, res) {
  const id = req.param('id');
  log.debug('Looking up uom with ' + id);
  var uom = data.uom(id);
  setTimeout(function() {
    res.json(uom);
  }, _.random(200, 1000));
});

app.post('/rest/uom/value', function(req, res) {
  const uomTypeId = req.body.uomTypeId;
  const obj = data.uomTypes().filter((val,i) => val.uomTypeId == uomTypeId);
  const uomType = obj[0];
  const uomId = req.body.uomId;
  const description = req.body.description;
  const abbreviation = req.body.abbreviation;
  const decimalScale = req.body.decimalScale;
  const minValue = req.body.minValue;
  const maxValue = req.body.maxValue;
  const uom = {uomType: uomType, uomId: uomId,
               abbreviation: abbreviation, description: description,
               minValue: minValue, maxValue: maxValue,
               decimalScale: decimalScale};
  log.debug('Create uom ', uom);
  let index = data.createUom(uom);
  setTimeout(function() {
    res.json({ uomId: uomId });
  }, _.random(200, 1000));
});

app.put('/rest/uom/value/:id', function(req, res) {
  const id = req.param('id');
  log.debug('Update uom ' + id);
  // uomTypeId si trova nel body
  // usato per prendere uomType

  // nell'uom passo uomType: uomType
  const uomTypeId = req.body.uomTypeId;
  const obj = data.uomTypes().filter((val,i) => val.uomTypeId == uomTypeId);
  const uomType = obj[0];
  const uomId = req.body.uomId;
  const description = req.body.description;
  const abbreviation = req.body.abbreviation;
  const decimalScale = req.body.decimalScale;
  const minValue = req.body.minValue;
  const maxValue = req.body.maxValue;
  const uom = {uomType: uomType, uomId: uomId,
               abbreviation: abbreviation, description: description,
               minValue: minValue, maxValue: maxValue,
               decimalScale: decimalScale};
  const index = data.updateUom(id, uom);
  setTimeout(function() {
    res.json({ uomId: uomId });
  }, _.random(200, 1000));
});

app.delete('/rest/uom/value/:id', function(req, res) {
  const id = req.param('id');
  log.debug('Delete uom ' + id);
  const index = data.deleteUom(id);
  setTimeout(function() {
    res.json({ uomId: id });
  }, _.random(200, 1000));
});


app.get('/rest/uom/scale/:id', function(req, res) {
  const id = req.param('id');
  var uomRatingScales = data.uomRatingScales(id);
  log.debug('Looking up uomRatingScales for ' + id);
  setTimeout(function() {
    res.json({ results: uomRatingScales, total: uomRatingScales.length });
  }, _.random(200, 1000));
});

// uomId si trova nel body
// usato per prendere uom
app.post('/rest/uom/scale', function(req, res) {
  const uomId = req.body.uomId;
  const uomRatingValue = req.body.uomRatingValue;
  log.debug('Create uomRatingScale ' + uomId + " " + uomRatingValue);
  const obj = data.uoms().filter((val,i) => val.uomId == uomId);
  const uom = obj[0];
  const description = req.body.description;
  const uomRatingScale = {uom: {uomId: uomId, description: uom.description},
               description: description, uomRatingValue: uomRatingValue};
  log.debug('Create uomRatingScale ', uomRatingScale);
  let index = data.createUomRatingScale(uomRatingScale);
  setTimeout(function() {
    res.json({ uomId: uomId, uomRatingValue: uomRatingValue });
  }, _.random(200, 1000));
});

app.put('/rest/uom/scale/:id/:value', function(req, res) {
  const id = req.param('id');
  const value = req.param('value');
  log.debug('Update uomRatingScale ' + id + " " + value );

  // uomId si trova nel body ed anche nella request
  // usato per prendere uom

  // nell'uomRatingScale passo uom: uom
  const obj = data.uoms().filter((val,i) => val.uomId == id);
  const uom = obj[0];
  const uomId = uom.uomId;
  const description = req.body.description;
  const uomRatingValue = req.body.uomRatingValue;
  const uomRatingScale = {uom: {uomId: uomId, description: uom.description},
               uomRatingValue: uomRatingValue, description: description};
  log.debug('Update uomRatingScale ', uomRatingScale);
  const index = data.updateUomRatingScale(id, value, uomRatingScale);
  setTimeout(function() {
    res.json({ uomId: uomId, uomRatingValue: uomRatingValue });
  }, _.random(200, 1000));
});

app.delete('/rest/uom/scale/:id/:value', function(req, res) {
  const id = req.param('id');
  const value = req.param('value');
  log.debug('Delete uom ' + id + " " + value);
  const index = data.deleteUomRatingScale(id, value);
  log.debug('Delete index ' + index);
  setTimeout(function() {
    res.json({ uomId: id, uomRatingValue: value });
  }, _.random(200, 1000));
});


//timesheet/party-period
app.get('/rest/timesheet/entries', function(req, res) {
  var timesheets = data.timesheets();
  log.debug('Looking up timesheets ' + timesheets);
  setTimeout(function() {
    res.json({ results: timesheets, total: timesheets.length });
  }, _.random(200, 1000));
});

app.listen(PORT);
log.info("Server started: http://localhost:" + PORT);

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
    log = require('./logger'),
    data = require('./data'),
    LOCALES = {
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
  // protects APIs with JWT
  app.use('/rest/', expressJwt({
    secret: SECRET,
    getToken: getToken,
    isRevoked: isRevoked
  }).unless({path: ['/rest/login', '/rest/profile/i18n']}));

  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);

  // serves static content from app folder and from bower_components
  if (process.env.OPT_ENV === 'dist') {
    app.use(express.static(path.join(__dirname, 'dist')));
    log.info("Serving static content from " + path.join(__dirname, 'dist'));
  } else {
    app.use(express.static(path.join(__dirname, 'app')));
    app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
  }

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
      formats: locale.formats
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
  log.debug('Logging out user', {email: req.user.email});
  if (req.user && req.user.email)
    data.revokeToken(req.user.email);
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

app.listen(PORT);
log.info("Server started: http://localhost:" + PORT);

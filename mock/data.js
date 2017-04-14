'use strict';

var _ = require('lodash'),
    moment = require('moment-timezone'),
    log = require('./logger'),
    util = require('util'),
    inc = (function() {
      var id = 1;
      return function() {
        return id++;
      };
    }()),
    TODAY = moment().startOf('day'),
    PERMISSIONS = {
      admin: 1 << 0,
      operator: 1 << 1
    },
    PEOPLE = {
    "gica": {
      id: inc(),
      username: "gica",
      firstName: "Gianluca",
      lastName: "Cattani",
      email: "gianluca.cattani@mapsgroup.it",
      permissions: PERMISSIONS.admin,
      authenticationType: 'DB'
    },
    "fast": {
      id: inc(),
      username: "fast",
      firstName: "Fabio",
      lastName: "Strozzi",
      email: "fabio.strozzi@mapsgroup.it",
      permissions: PERMISSIONS.admin | PERMISSIONS.operator,
      authenticationType: 'DB'
    },
    "anfo": {
      id: inc(),
      username: "anfo",
      firstName: "Andrea",
      lastName: "Fossi",
      email: "andrea.fossi@mapsgroup.it",
      permissions: PERMISSIONS.operator,
      authenticationType: 'LDAP'
    }
  },
  HEROES = [
    { id: 11, name: 'Mr. Nice' },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' },
    { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr IQ' },
    { id: 19, name: 'Magma' },
    { id: 20, name: 'Tornado' }
  ],
  tokens = {},
  secret = generateSecret();

function trueFilter() {
  return true;
}

function trueOrFalse() {
  return _.random(1) === 1;
}

function generateSecret() {
  return 'secret';
}

function userFilter(text) {
  var t = text.toLowerCase();

  return function(u) {
    var f = u.firstName.toLowerCase(),
        l = u.lastName.toLowerCase();
    return f.indexOf(t) !== -1 || l.indexOf(t) !== -1;
  };
}

/*----------------------------------------------------------------------------*/
/* Exported methods                                                           */
/*----------------------------------------------------------------------------*/
module.exports = {

  secret: function() {
    return secret;
  },

  authenticate: function(username, password) {
    if ((username === 'gica' && password === 'password') ||
        (username === 'anfo' && password === 'password') ||
        (username === 'fast' && password === 'password')) {
      return _(PEOPLE).find(function(p) {
        return p.username === username;
      });
    }
    return null;
  },

  storeToken: function(username, token) {
    tokens[username] = token;
  },

  revokeToken: function(username, tokenId) {
    delete tokens[username];
  },

  isRevoked: function(username, tokenId) {
    return tokens[username] === undefined;
  },

  heroes: function() {
    return HEROES;
  }
};

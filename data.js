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

function makeFailedMerge(id) {
  return {
    id: id,
    firstName: 'Alfabeto',
    lastName: 'Storpiato',
    birthDate: '1988-05-16',
    genre: id % 2 === 0 ? 'MALE' : (id % 3 === 0 ? 'FEMALE' : null),
    taxIdNo: 'ABCDEF88H17N666X',
    stp: 'BOHHH123',
    eni: 'SEEE09876',
    type: trueOrFalse() ? 'PHARMA' : 'SPECIALIST',
    prescriptionCode: '65798271232',
    prescriptionDate: moment(),
    retried: moment(),
    retries: _.random(1,10)
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

  users: function(query) {
    var n = _.random(1, query.size),
        ids = _.range(n),
        userKeys = _.map(PEOPLE, function(k) {
          return k.username;
        }),
        vals = _.map(ids, function() {
          var key = _.sample(userKeys, 1),
              user = PEOPLE[key];
          return {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            authenticationType: user.authenticationType,
            permissions: user.permissions
          };

        });
    return {results: vals, total: 500};
  },

  user: function(id) {
    var user = _.find(PEOPLE, function(u) {
      return u.id === id;
    });
    if (user) {
      return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        authenticationType: user.authenticationType,
        permissions: user.permissions
      };
    } else {
      return null;
    }
  },

  /**
   * Check if user with username exist
   * @param username
   * @returns {boolean}
   */
  userExist: function(username) {
    var user = _.find(PEOPLE, function(u) {
      return u.username === username;
    });
    return !!user;
  },

  createUpdateUser: function(userToSave) {
    var userId = inc(),
        currentUser;
    if (!userToSave.id) {
      PEOPLE[userToSave.username] = {
        id: userId,
        username: userToSave.username,
        firstName: userToSave.firstName,
        lastName: userToSave.lastName,
        email: userToSave.email,
        authenticationType: userToSave.authenticationType,
        permissions: userToSave.permissions,
        password: null
      };
      return {id: userId};
    } else {
      currentUser = this.user(userToSave.id);
      PEOPLE[userToSave.username] = {
        id: currentUser.id,
        username: currentUser.username,
        firstName: userToSave.firstName,
        lastName: userToSave.lastName,
        email: userToSave.email,
        authenticationType: userToSave.authenticationType,
        permissions: userToSave.permissions,
        password: currentUser.password
      };
      return {id: userToSave.id};
    }
  },

  merges: function(query) {
    var n = _.random(1, query.size),
        ids = _.range(n),
        vals = _.map(ids, makeFailedMerge);
    return {results: vals, total: 500};
  }
};

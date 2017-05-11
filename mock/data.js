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
      ADMIN: 'ADMIN',
      VIEW: 'VIEW',
      CREATE: 'CREATE',
      UPDATE: 'UPDATE',
      DELETE: 'DELETE'
    },
    PEOPLE = {
      "gica": {
        id: inc(),
        username: "gica",
        firstName: "Gianluca",
        lastName: "Cattani",
        email: "gianluca.cattani@mapsgroup.it",
        externalLoginKey: "adsdas010101010"
      },
      "fast": {
        id: inc(),
        username: "fast",
        firstName: "Fabio",
        lastName: "Strozzi",
        email: "fabio.strozzi@mapsgroup.it",
        externalLoginKey: "x0x0x0x0y1y1y1y1"
      },
      "anfo": {
        id: inc(),
        username: "anfo",
        firstName: "Andrea",
        lastName: "Fossi",
        email: "andrea.fossi@mapsgroup.it",
        externalLoginKey: "0987654321abcdef"
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
  },

  permissions: function(username) {
    return  {
      permissions: {
        'OFBTOOLS': [PERMISSIONS.ADMIN],
        'CUSTOMEXT': [PERMISSIONS.VIEW, PERMISSIONS.CREATE, PERMISSIONS.UPDATE],
        'WORKEFFORT': [PERMISSIONS.VIEW, PERMISSIONS.CREATE, PERMISSIONS.UPDATE, PERMISSIONS.DELETE]
      }
    };
  },

  menu: function() {
    return {
      id: 'GP_MENU',
      children: [
        { id: 'GP_MENU_00001', label: 'Menu 1' },
        { id: 'GP_MENU_00002', label: 'Menu 2' },
        { id: 'GP_MENU_00003', label: 'Menu 3' }
      ]
    };
  }
}

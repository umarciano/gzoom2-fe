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
    UOM_TYPE = [
      { uomTypeId: 'CURRENCY_MEASURE', description: 'Valuta' },
      { uomTypeId: 'DATE_MEASURE', description: 'Data' },
      { uomTypeId: 'OTHER_MEASURE', description: 'Altro' },
      { uomTypeId: 'RATING_SCALE', description: 'Scale Valori' },
      { uomTypeId: 'TIME_FREQ_MEASURE', description: 'Tempo/Frequenza' }
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
    const root = {
      id: 'GP_MENU',
      children: [
        { id: 'GP_MENU_00001', label: 'Performance Management', classes: ['ion ion-speedometer'] },
        { id: 'GP_MENU_00002', label: 'Governance', classes: ['fa-balance-scale'] },
        { id: 'GP_MENU_00003', label: 'Accountability', classes: ['fa-money'] },
        { id: 'GP_MENU_00004', label: 'Basic Data', classes: ['fa-database'] }
      ]
    };

    function _4rdLvlMenu(par) {
      par.children = [
        // leaves
        { id: par.id + '.1', label: 'Leaf Menu 1' },
        { id: par.id + '.2', label: 'Leaf Menu 2' },
        { id: par.id + '.3', label: 'Leaf Menu 3' }
      ];
    }

    function _3rdLvlMenu(par) {
      par.children = [
        // folders
        { id: par.id + '.A', label: 'Menu Folder A', classes: [], children: [] },
        // leaves
        { id: par.id + '.1', label: 'Leaf Menu 1', classes: ['fa-envelope-o'], params: null},
        { id: par.id + '.2', label: 'Leaf Menu 2', classes: ['fa-dashboard'], params: {}},
        { id: par.id + '.3', label: 'Leaf Menu 3', classes: []},
        { id: par.id + '.4', label: 'Leaf Menu 4', classes: []},
        { id: par.id + '.5', label: 'Leaf Menu 5', classes: []},
        { id: par.id + '.6', label: 'Leaf Menu 6'},
        { id: par.id + '.7', label: 'Leaf Menu 7', classes: null},
        { id: 'GP_MENU_00006',  label: 'GP_MENU_00006', classes: null}
      ];

      par.children
        .filter(c => c.children) // just get folders
        .forEach(c => _4rdLvlMenu(c));
    }

    function _2ndLvlMenu(par) {
      par.children = [
        // folders
        { id: par.id + '_A', label: 'Menu Folder A', classes: [], children: [] },
        { id: par.id + '_B', label: 'Menu Folder B', children: [] },
        { id: par.id + '_C', label: 'Menu Folder C', classes: ['fa-bar-chart'], children: [] },
        // leaves
        { id: par.id + '_1', label: 'Menu Leaf 1', classes: ['fa-user-circle-o'], params: {} },
        { id: par.id + '_2', label: 'Menu Leaf 2', params: {} },
        { id: par.id + '_3', label: 'Menu Leaf 3', classes: ['fa-circle'] }
      ];

      par.children
        .filter(c => c.children) // just get folders
        .forEach(c => _3rdLvlMenu(c));
    }

    root.children.forEach(c => _2ndLvlMenu(c));
    return root;
  },

  uomTypes: function() {
    return UOM_TYPE;
  }
};

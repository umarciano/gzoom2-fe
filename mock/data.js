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
        externalLoginKey: "adsdas010101010",
        currentPassword: "adsdas010101010"
      },
      "fast": {
        id: inc(),
        username: "fast",
        firstName: "Fabio",
        lastName: "Strozzi",
        email: "fabio.strozzi@mapsgroup.it",
        externalLoginKey: "x0x0x0x0y1y1y1y1",
        currentPassword: "x0x0x0x0y1y1y1y1"
      },
      "anfo": {
        id: inc(),
        username: "anfo",
        firstName: "Andrea",
        lastName: "Fossi",
        email: "andrea.fossi@mapsgroup.it",
        externalLoginKey: "0987654321abcdef",
        currentPassword: "0987654321abcdef"
      },
      "admin": {
        id: inc(),
        username: "admin",
        firstName: "admin",
        lastName: "admin",
        email: "admin.admin@mapsgroup.it",
        externalLoginKey: "opopopopop1y1y1y1",
        currentPassword: "opopopopop1y1y1y1"
      }
    },
    UOM_TYPE = [
      { uomTypeId: 'CURRENCY_MEASURE', description: 'Valuta' },
      { uomTypeId: 'DATE_MEASURE', description: 'Data' },
      { uomTypeId: 'OTHER_MEASURE', description: 'Altro' },
      { uomTypeId: 'RATING_SCALE', description: 'Scale Valori' },
      { uomTypeId: 'TIME_FREQ_MEASURE', description: 'Tempo/Frequenza' }
    ],
    UOM = [
      { uomId: 'EUR', uomType: {uomTypeId: 'CURRENCY_MEASURE', description: 'Valuta'}, abbreviation: 'EUR', description: 'Euro', decimalScale: 2},
      { uomId: 'OTH_100', uomType: {uomTypeId: 'OTHER_MEASURE', description: 'Altro'}, abbreviation: 'Perc.', description: 'Percentuale', decimalScale: 2},
      { uomId: 'OTH_NUM', uomType: {uomTypeId: 'OTHER_MEASURE', description: 'Altro'}, abbreviation: 'Num.', description: 'Numero', decimalScale: 2},
      { uomId: 'OTH_SCO', uomType: {uomTypeId: 'OTHER_MEASURE', description: 'Altro'}, abbreviation: 'Punt.', description: 'Punteggio', decimalScale: 0},
      { uomId: 'AA_UOMO', uomType: {uomTypeId: 'OTHER_MEASURE', description: 'Altro'}, abbreviation: 'AA/uomo', description: 'Anni/Uomo', decimalScale: 2},
      { uomId: 'EVAL_IND', uomType: {uomTypeId: 'OTHER_MEASURE', description: 'Altro'}, abbreviation: 'Val.Ob.Ind.', description: 'Valutazione obiettivi individuali', decimalScale: 2, minValue: 0.000000, maxValue: 100.000000},
      { uomId: 'RAT_615', uomType: {uomTypeId: 'RATING_SCALE', description: 'Scale Valori'}, abbreviation: '6...15', description: 'Scala valutazione da 6 a 15', decimalScale: 0},
      { uomId: 'RAT_620', uomType: {uomTypeId: 'RATING_SCALE', description: 'Scale Valori'}, abbreviation: '6...20', description: 'Scala valutazione da 6 a 20', decimalScale: 0},
      { uomId: 'RAT_625', uomType: {uomTypeId: 'RATING_SCALE', description: 'Scale Valori'}, abbreviation: '6...25', description: 'Scala valutazione da 6 a 25', decimalScale: 0},
      { uomId: 'RAT_APO', uomType: {uomTypeId: 'RATING_SCALE', description: 'Scale Valori'}, abbreviation: '0...10', description: 'Scala valutazione comportamenti APO', decimalScale: 0},
      { uomId: 'RAT_SN', uomType: {uomTypeId: 'RATING_SCALE', description: 'Scale Valori'}, abbreviation: 'S/N', description: 'Si / No', decimalScale: 0},
      { uomId: 'RAT_VAL', uomType: {uomTypeId: 'RATING_SCALE', description: 'Scale Valori'}, abbreviation: '1...5', description: 'Scala valutazione comportamenti Dirigenti', decimalScale: 0},
      { uomId: 'SN', uomType: {uomTypeId: 'RATING_SCALE', description: 'Scale Valori'}, abbreviation: 'S/N', description: 'Presente S/N	', decimalScale: 0}
    ],
    UOM_RATING_SCALE = [
      { uom: {uomId: 'RAT_VAL', description: 'Scala valutazione comportamenti Dirigenti'}, uomType: {uomTypeId: 'RATING_SCALE', description: 'Scale Valori'}, uomRatingValue:0.000000, description:'X'},
      { uom: {uomId: 'RAT_VAL', description: 'Scala valutazione comportamenti Dirigenti'}, uomType: {uomTypeId: 'RATING_SCALE', description: 'Scale Valori'}, uomRatingValue:100.000000, description:''},
      { uom: {uomId: 'SN', description: 'Presente S/N	'}, uomType: {uomTypeId: 'RATING_SCALE', description: 'Scale Valori'}, uomRatingValue:0.000000, description:'No'},
      { uom: {uomId: 'SN', description: 'Presente S/N	'}, uomType: {uomTypeId: 'RATING_SCALE', description: 'Scale Valori'}, uomRatingValue:100.000000, description:'Sì'}
    ],    
    PARTY = [
      { partyId: '1', firstName: 'CORTI', lastName: 'MARIACHIARA', partyName : "CORTI MARIACHIARA" },
      { partyId: '2', firstName: 'STEFANONI', lastName: 'SILVANO', partyName : "STEFANONI SILVANO"  },
      { partyId: '3', firstName: 'RIVA', lastName: 'SILVIA', partyName : "RIVA SILVIA"  }
    ],
    REPORT = [
      { reportContentId: 'REP_TIMESHEET', reportName: 'Stampa Timesheet', parentTypeId: 'CTX_PR',
       outputFormat: ['pdf'], 
       workEffortTypeId: ['PRVST'], 
       params: {orgUnitId: 'string', partyId: 'string'}},
      { reportContentId: 'REP_MENS_MACATT', reportName: 'Stampa mensile Macro-attività', parentTypeId: 'CTX_PR',
       outputFormat: ['pdf', 'xls'], 
       workEffortTypeId: ['PRVST'], 
       params: {orgUnitId: 'string', partyId: 'string'}},
      { reportContentId: '10000', reportName: 'pippo', parentTypeId: 'CTX_OR'  }
    ],
    WORK_EFFORT = [
      {attivitaLiv1: 'livello 1', attivitaLiv2 : 'livello 1.1', attivitaLiv3: 'livello 1.1.1', workEffortId: '10000'},
      {attivitaLiv1: 'livello 1', attivitaLiv2 : 'livello 1.2', attivitaLiv3: 'livello 1.2.1', workEffortId: '10001'},
      {attivitaLiv1: 'livello 1', attivitaLiv2 : 'livello 1.3', attivitaLiv3: 'livello 1.3.1', workEffortId: '10002'}
    ],
    TIMESHEET = [
      {partyId: '1', timesheetId: '1', fromDate: '2017-05-01', thruDate: '2017-5-31', contractHours: 5, actualHours: 10, partyName : "CORTI MARIACHIARA" },
      {partyId: '2', timesheetId: '2', fromDate: '2017-05-01', thruDate: '2017-5-31', contractHours: 11, actualHours: 20, partyName : "STEFANONI SILVANO" },
      {partyId: '3', timesheetId: '3', fromDate: '2017-05-01', thruDate: '2017-5-31', contractHours: 15, actualHours: 30, partyName : "RIVA SILVIA" },
      {partyId: '4', timesheetId: '4', fromDate: '2017-05-01', thruDate: '2017-5-31', contractHours: 21, actualHours: 40, partyName : "ZUCCHI MARIALUIGIA" },
      {partyId: '5', timesheetId: '5', fromDate: '2017-05-01', thruDate: '2017-5-31', contractHours: 31, actualHours: 50, partyName : "PARTY NAME PROVA" }
    ],
    TIME_ENTRY = [
      {timeEntryId: '1', timesheetId: '1', workEffortId : '10000', percentage: '10', description: 'livello 1 - livello 1.1 - livello 1.1.1'},
      {timeEntryId: '2', timesheetId: '1', workEffortId : '10001', percentage: '8', description: 'livello 1 - livello 1.2 - livello 1.2.1'},
      {timeEntryId: '3', timesheetId: '1', workEffortId : '10002', percentage: '50', description: 'livello 1 - livello 1.3 - livello 1.3.1'}
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
        (username === 'fast' && password === 'password') ||
        (username === 'admin' && password === 'admin')) {
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
        { id: 'GP_MENU_00001', label: 'Performance Management', classes: ['fa-cogs'] },
        { id: 'GP_MENU_00002', label: 'Governance', classes: ['fa-tachometer-alt'] },
        { id: 'GP_MENU_00003', label: 'Accountability', classes: ['fa-tasks'] },
        { id: 'GP_MENU_00004', label: 'Basic Data', classes: ['fa-chart-line'] }
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
        { id: 'GP_MENU_00006',  label: 'GP_MENU_00006', classes: null},
        { id: 'GP_MENU_00332',  label: 'GP_MENU_00332', classes: null},
        { id: 'GP_MENU_00333',  label: 'GP_MENU_00333', classes: null},
        { id: 'GP_MENU_00334',  label: 'GP_MENU_00334', classes: null},
        { id: 'GP_MENU_00335',  label: 'GP_MENU_00335', classes: null},
        { id: 'GP_MENU_00347',  label: 'GP_MENU_00347', classes: null},
        { id: 'GP_MENU_00999',  label: 'GP_MENU_00999', classes: null}
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
  },

  findSelectedUomTypeIndex(uomType) {
    return UOM_TYPE.indexOf(uomType);
  },

  createUomType: function(uomType) {
    const index = this.findSelectedUomTypeIndex(uomType);
    if(index < 0)
        UOM_TYPE.push(uomType);
    return index;
  },

  updateUomType: function(id, uomType) {
    const obj = UOM_TYPE.filter((val,i) => val.uomTypeId == id);
    const index = this.findSelectedUomTypeIndex(obj[0]);
    if(index >= 0)
      UOM_TYPE[index] = uomType;
    return index;
  },

  deleteUomType: function(id) {
    UOM_TYPE = UOM_TYPE.filter((val,i) => val.uomTypeId != id);
    return id;
  },

  uoms: function() {
      return UOM;
  },

  uom: function(id) {
      return UOM.filter((val,i) => val.uomId == id)[0];
  },

  findSelectedUomIndex(uom) {
    return UOM.indexOf(uom);
  },

  createUom: function(uom) {
    const index = this.findSelectedUomIndex(uom);
    if(index < 0)
        UOM.push(uom);
    return index;
  },

  // a partire dalle chiavi recupero oggetto uom
  updateUom: function(id, uom) {
    const obj = UOM.filter((val,i) => val.uomId == id);
    const index = this.findSelectedUomIndex(obj[0]);
    if(index >= 0)
      UOM[index] = uom;
    return index;
  },

  deleteUom: function(id) {
    UOM = UOM.filter((val,i) => val.uomId != id);
    return id;
  },

  uomRatingScales: function(uomId) {
    return UOM_RATING_SCALE.filter((val,i) => val.uom.uomId == uomId);
  },

  findSelectedUomRatingScaleIndex(uomRatingScale) {
    return UOM_RATING_SCALE.indexOf(uomRatingScale);
  },

  createUomRatingScale: function(uomRatingScale) {
    const index = this.findSelectedUomRatingScaleIndex(uomRatingScale);
    if(index < 0)
        UOM_RATING_SCALE.push(uomRatingScale);
    return index;
  },

  // a partire dalle chiavi recupero oggetto uom
  updateUomRatingScale: function(id, value, uomRatingScale) {
    const obj = UOM_RATING_SCALE.filter((val,i) => val.uom.uomId == id && val.uomRatingValue == Number(value));
    const index = this.findSelectedUomRatingScaleIndex(obj[0]);
    if(index >= 0)
      UOM_RATING_SCALE[index] = uomRatingScale;
    return index;
  },

  deleteUomRatingScale: function(id, value) {
    UOM_RATING_SCALE = UOM_RATING_SCALE.filter((val,i) => val.uom.uomId != id || val.uomRatingValue != Number(value));
    return id;
  },


  //timesheet
  timesheets: function() {
    return TIMESHEET;
  },

  timesheet: function(id) {
    return TIMESHEET.filter((val,i) => val.timesheetId == id)[0];
  },

  partys: function () {
    return PARTY;
  },
  
  timeEntries: function () {
    return TIME_ENTRY;
  },
  
  workEfforts: function () {
    return WORK_EFFORT;
  },

  createOrUpdateTimeEntry: function(timeEntries) {

  },

  reports: function(parentTypeId) {
    return REPORT.filter((val,i) => val.parentTypeId == parentTypeId);
  },

  report: function(reportContentId) {
    return REPORT.filter((val,i) => val.reportContentId == reportContentId)[0];
  }

};

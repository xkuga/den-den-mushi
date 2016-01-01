var config = require('./config');
var moment = require('moment');

var utils = {};

utils.time = function(format) {
  if (format === undefined) {
    format = config.datetimeFormat;
  }
  return moment().format(format);
};

utils.timestamp = function() {
  return moment().unix();
};

utils.escapeHtml = function(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
};

module.exports = utils;

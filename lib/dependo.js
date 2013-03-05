'use strict';

var madge = require('madge');

function Dependo(targetPath, options) {

  this.config = options || {};
  this.config.format = String(options.format || 'amd').toLowerCase();
  this.config.exclude = options.exclude || null;

  this.dependencies = madge(targetPath, this.config).tree;

}

Dependo.prototype.generateHtml = function (options) {
  return require('./html').output(this.dependencies, options);
};

module.exports = Dependo;

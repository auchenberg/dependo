'use strict';

var madge = require('madge');
var sha1 = require('sha-1');

function Dependo(targetPath, options) {

    this.config = options || {};
    this.config.format = String(options.format || 'amd').toLowerCase();
    this.config.exclude = options.exclude || null;
    this.identification = sha1(targetPath + JSON.stringify(this.config)) || ~~(Math.random()*999999999);
    this.title = options.title || 'dependo';
    
    if (this.config.format==='json') {
        this.dependencies = this.config.directDeps;
    } else {
        this.dependencies = madge(targetPath, this.config).tree;
    }

    if (this.config.transform && typeof (this.config.transform) == 'function') {
        this.dependencies = this.config.transform(this.dependencies);
    }

}

Dependo.prototype.generateHtml = function () {
    return require('./html').output(this.dependencies, this.identification, this.title);
};

module.exports = Dependo;

'use strict';

var madge = require('madge');
var sha1 = require('sha-1');

function Dependo(targetPath, options) {
    this.config = options || {};

    this.basePath = options.basePath;
    this.config.format = String(options.format || 'amd').toLowerCase();
    this.config.exclude = options.exclude || null;
    this.title = options.title || 'dependo';

    if (this.config.layout && this.config.layoutData) {
        this.identification = 'CustomLayout';
        this.layoutData = this.config.layoutData;
    }
    else {
        this.identification = sha1(targetPath + JSON.stringify(this.config)) || ~~(Math.random()*999999999);
    }

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
    return require('./html').output(this.basePath, this.dependencies, this.identification, this.title, this.layoutData);
};

module.exports = Dependo;

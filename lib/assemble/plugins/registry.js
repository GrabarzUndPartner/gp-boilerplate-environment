"use strict";

var through = require('through2');
var cheerio = require('cheerio');
var controller = require('./registry/controller');
var partial = require('./registry/partial');

module.exports = {
    reset: function() {
        controller.reset();
        partial.reset();
    },
    collect: function() {
        return through.obj(function(file, enc, cb) {
            if (file.contents) {
                var $ = cheerio.load(file.contents.toString(enc));
                controller.collect($);
                partial.collect($);
            }
            cb();
        });
    },
    collectFromFile: function() {
        var enc = 'utf-8';
        return function(file) {
            if (file.contents) {
                var $ = cheerio.load(file.contents.toString(enc));
                controller.collect($);
                partial.collect($);
            }
        };
    },
    createRegistry: function(controllerRegistry) {
        return Promise.all([controller.createRegistry(controllerRegistry), partial.createRegistry(controllerRegistry)]);
    }
};

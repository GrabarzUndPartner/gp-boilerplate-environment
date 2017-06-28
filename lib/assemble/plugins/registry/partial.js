'use strict';

var unique = require('lodash/uniq');
var template = require('./partial/template.hbs');
var fs = require('fs');
var mkdirp = require('mkdirp');
var upath = require('upath');

var rootPath = "src/pcss";
var files = [{
    name: 'partials.pcss',
    list: [],
    critical: false
}, {
    name: 'partials.critical.pcss',
    list: [],
    critical: true,
    chunk: false
}];
module.exports = {
    reset: function() {
        files.forEach(function(file) {
            file.list = [];
        });
    },
    collect: function($) {
        files.forEach(function(file) {
            var $nodes = $('.partial[data-partial]').not('[data-partial^="docs/"]');
            if (file.critical) {
                $nodes = $nodes.filter('[data-critical]');
            }
            if (!file.chunk || file.critical) {
                $nodes = $nodes.not('[data-chunk]');
            }
            addPartialsToList(file.list, $nodes);
        });
        return $;
    },

    createRegistry: function() {
        var complete = [];
        files.forEach(function(file) {
            complete.push(new Promise(function(resolve) {
                var list = unique(file.list);
                writeFile(upath.resolve(rootPath, file.name), template({
                    partials: list.sort()
                }), function() {
                    console.log('saved file:', file.name);
                    resolve();
                });
            }));
        });
        return Promise.all(complete);
    }
};

function addPartialsToList(list, nodes) {
    for (var i = 0; i < nodes.length; i++) {
        list.push(nodes.eq(i).data('partial'));
    }
}

function writeFile(path, content, cb) {
    mkdirp(upath.dirname(path), function(err) {
        if (err) {
            return cb(err);
        }
        fs.writeFile(path, content, cb);
    });
}

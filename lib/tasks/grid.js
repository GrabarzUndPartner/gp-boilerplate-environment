"use strict";

var gulp = require('gulp');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('upath');
var reduce = require('lodash/reduce');
var taskGenerator = require('../taskGenerator');
var runSequence = require('run-sequence').use(gulp);

module.exports = function(name, config, serverConfig) {

    return taskGenerator(name, config, serverConfig, function(taskName, task) {
            var results = {},
                features;
            gulp.task(taskName, function() {
                // preapare features
                var config = require(task.config);
                var options = config.options;
                features = reduce(config.features, function(features, feature) {
                    features.push(new feature.file(config.options, (feature.options || {}) || {}));
                    return features;
                }, []);
                config.options.breakpoints.forEach(function(breakpoint) {
                    var next = options.breakpoints[config.options.breakpoints.indexOf(breakpoint) + 1];
                    features.forEach(function(feature) {
                        (results[feature.name] = (results[feature.name] || [])).push(feature.generate(breakpoint, next).join(' '));
                    });
                });
                var files = [],
                    css = [];
                // write single files
                features.forEach(function(feature) {
                    var fileName = (options.filePrefix ? options.filePrefix + '-' : '') + (options.fileName || task.name) + '.' + feature.name + '.pcss';
                    files.push(writeFile(path.resolve(task.dest, fileName), results[feature.name].join(' ')));
                    css.push('@import "./' + fileName + '";');
                });
                // write complete file with imports
                files.push(writeFile(path.resolve(task.dest, (options.filePrefix ? options.filePrefix + '-' : '') + (options.fileName || task.name) + '.pcss'), css.join(' ')));
                return global.Promise.all(files);
            });
        },
        function(config, tasks, cb) {
            runSequence.call(null, tasks, function() {
                cb();
            });
        });
};

function writeFile(filePath, content) {
    return new global.Promise(function(resolve, reject) {
        mkdirp(path.dirname(filePath), function(err) {
            if (err) {
                return reject(err);
            }
            fs.writeFile(filePath, content, resolve);
        });
    });
}

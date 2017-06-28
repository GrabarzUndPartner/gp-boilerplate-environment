"use strict";

var gulp = require('gulp');
var upath = require('upath');
var fontmin = require('gulp-fontmin');
var taskGenerator = require('../taskGenerator');
var runSequence = require('run-sequence').use(gulp);

module.exports = function(name, config, serverConfig) {
    if (config) {
        return taskGenerator(name, config, serverConfig, function(taskName, task) {
            gulp.task(taskName, function() {
                return new Promise(function(resolve) {
                    var buffer = [];
                    gulp.src(task.files.src)
                        .on('data', function(file) {
                            var src = upath.join(upath.dirname(file.path), '/**/*.{ttf,woff}');
                            var text = file.contents.toString('utf-8');
                            var dest = upath.join(task.files.dest, upath.dirname(file.relative));
                            buffer.push(minifyFont(src, dest, text));

                        }).on('end', function() {
                            Promise.all(buffer).then(resolve);
                        });
                });
            });

        }, function(config, tasks, cb) {
            runSequence.call(null, tasks, function() {
                cb();
            });
        });
    }
};

function minifyFont(src, dest, text) {
    return new Promise(function(resolve) {
        gulp.src(src)
            .pipe(fontmin({
                text: text
            }))
            .pipe(gulp.dest(dest)).on('end', resolve);
    });
}

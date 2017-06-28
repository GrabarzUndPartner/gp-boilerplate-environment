"use strict";
var gulp = require('gulp');
var svgSymbols = require('gulp-svg-symbols');
var rename = require('gulp-rename');
var taskGenerator = require('../taskGenerator');
var runSequence = require('run-sequence').use(gulp);

module.exports = function(name, config, serverConfig) {
    return taskGenerator(name, config, serverConfig, function(taskName, task) {
        gulp.task(taskName, function() {
            var config = require(task.config);
            return gulp.src(task.files.src)
                .pipe(svgSymbols(config))
                .pipe(rename({
                    basename: task.name
                }))
                .pipe(gulp.dest(task.files.dest));
        });
    }, function(config, tasks, cb) {
        runSequence.call(null, tasks, function() {
            cb();
        });
    });
};

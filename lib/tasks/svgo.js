"use strict";

var taskGenerator = require('../taskGenerator');
var gulp = require('gulp');
var svgo = require('gulp-svgo');

module.exports = function(name, config, serverConfig) {
    return taskGenerator(name, config, serverConfig, function(taskName, task) {
        gulp.task(taskName, function() {
            return gulp.src(task.files.src)
            .pipe(svgo(require(task.config)))
            .pipe(gulp.dest(task.files.dest));
        });
    });
};

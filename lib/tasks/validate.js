"use strict";

var gulp = require('gulp');
var taskGenerator = require('../taskGenerator');
var errorHandler = require('../assemble/plugins/error').validate;
var htmlv = require('gulp-html-validator');

module.exports = function(name, config, serverConfig) {
    return taskGenerator(name, config, serverConfig, function(taskName, task) {
        gulp.task(taskName, function() {
            return gulp.src(task.files.src)
                .pipe(htmlv({
                    format: 'html'
                }).on('error', errorHandler))
                .pipe(gulp.dest(task.files.dest));
        });
    });
};

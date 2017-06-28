"use strict";

var template = require('lodash/template');
var upath = require('upath');
var options = require('minimist')(process.argv.slice(2));
var serverConfig = require(process.cwd() + options.serverConfig);
var tasksDir = options.gulpTaskConfig;

var gulp = require('gulp');
var fs = require('fs');
var runSequence = require('run-sequence').use(gulp);
var livereload = require('gulp-livereload');

/*
 * Watch
 */

var watch;
if (process.env.MODULE_DEV && !fs.existsSync(process.cwd() + tasksDir + 'watch/config')) {
    watch = require('gp-boilerplate/env/config/watch/config');
} else {
    watch = require(process.cwd() + tasksDir + 'watch/config');
}

gulp.task('watch', function(cb) {
    if (watch[process.env.NODE_ENV]) {
        livereload.listen(watch.config);
    }
    cb();
});

/*
 * Create Tasks
 */

var glob = require('glob');
var createdTasks = [];

var files = glob.sync('**/map.json', {
    cwd: process.cwd() + tasksDir,
    root: '/',
    absolute: true
});
files.forEach(function(file) {
    createdTasks.push(getNameFromConfigPath(file));
    createTask(getJSON(file, {
        'destination': upath.join(serverConfig.dest),
        'destination_root': upath.join(process.cwd()),
        'root': upath.join(process.cwd())
    }));
});

function getNameFromConfigPath(path) {
    return path.replace(/.*\/env\/config\/([^\/]*)\/.*/, '$1');
}

/*
 * Create Default Boilerplate Tasks, When Module Development.
 */

if (process.env.MODULE_DEV) {
    var files = glob.sync('**/map.json', {
        cwd: upath.join(process.cwd(), 'node_modules', 'gp-boilerplate', tasksDir),
        root: '/',
        absolute: true
    });
    files.forEach(function(file) {
        if (createdTasks.indexOf(getNameFromConfigPath(file)) === -1) {
            createTask(getJSON(file, {
                'destination': upath.join(serverConfig.dest),
                'destination_root': upath.join(process.cwd()),
                'root': upath.join(process.cwd(), 'node_modules', 'gp-boilerplate'),

            }));
        }
    });
}

function createTask(options) {
    gulp.task(options.name, require(options.task)(options.name, options.config, watch));
}

function getJSON(path, options) {
    return JSON.parse(template(JSON.stringify(require(path)))(options));
}


/*
 * Override prebuild & build task, for custom tasks sequence.
 */

if (!('prebuild' in gulp.tasks)) {
    gulp.task('prebuild', function(callback) {
        runSequence('clean', 'svg-symbols', ['copy', 'fontmin', 'svgo', 'grid', 'webpack:embed'], 'postcss', 'handlebars', callback);
    });
}

if (!('build' in gulp.tasks)) {
    gulp.task('build', function(callback) {
        runSequence('prebuild', 'webpack:app', ['validate', 'sitemap'], 'zip:default', callback);
    });
}

"use strict";

var assemble = require('assemble')();
var path = require('upath');
var merge = require('mixin-deep');
var engine = require('engine-handlebars');

assemble.engine('hbs', engine);


assemble.helpers(require('template-helpers')());
require('handlebars-layouts').register(engine.Handlebars);



assemble.helper('mixin', require('../handlebars/helpers/mixin')(engine.Handlebars, assemble));
assemble.asyncHelper('doc', require('../handlebars/helpers/doc')(assemble));
assemble.asyncHelper('raw', require('../handlebars/helpers/raw'));
assemble.asyncHelper('glob', require('../handlebars/helpers/glob'));
assemble.asyncHelper('globTree', require('../handlebars/helpers/globTree'));
assemble.asyncHelper('base64', require('../handlebars/helpers/base64'));
// assemble.asyncHelper('test', require('../handlebars/helpers/test'));

assemble.option('renameKey', function(filename, content, options) {
    if (path.extname(filename) === '.json') {
        return options.namespace(filename, options);
    }
    return filename;
});



assemble.partials.option('renameKey', function(fp, view) {
    if (view) {
        fp = path.relative(this.option('base') || '', fp);
        if (process.env.MODULE_DEV) {
            return fp
                .replace(/^[./]*\/src\/(.*)$/, path.join(process.env.npm_package_name, '$1'))
                .replace(/(.*\/)((gp-boilerplate-.*)|(gp-module-.+))/, '$2')
                .replace(path.extname(fp), '')
                .replace(/((gp-boilerplate-.+)|(gp-module-.+))\/(default|index)/, '$1');
        } else {
            return fp
                .replace(/(.*\/)((gp-boilerplate-.*)|(gp-module-.+))/, '$2')
                .replace(path.extname(fp), '')
                .replace(/((gp-boilerplate-[^\/]*)|(gp-module-[^\/]+))\/(default|index)/, '$1');
        }
    }
    return fp;
});

assemble.layouts.option('renameKey', function(fp, view) {
    if (view) {
        return path.relative(this.option('base') || '', fp)
            .replace(/(.*\/)((gp-boilerplate-.*)|(gp-module-.*))/, '$2')
            .replace(path.extname(fp), '')
            .replace(/((gp-boilerplate-[^\/]*)|(gp-module-[^\/]*))\/(default|index)/, '$1');
    }
    return fp;
});

assemble.preRender(/\.hbs$/, mergeContext(assemble));

function mergeContext(app, locals) {
    return function(view, next) {
        var key = view.relative.replace(path.extname(view.relative), '');
        view.layout = view.data.layout || view.layout;
        view.data = merge({
            relativeToRoot: getRelativeToRoot(view),
            partial: key.replace('partials/', '')
        }, locals, view.data.data || view.data, app.cache.data[key] || {});
        next();
    };
}

function getRelativeToRoot(view) {
    var relativeToRoot = path.relative(path.dirname(view.key), view.base).replace(path.extname(view.key), '') || '.';
    if (view.options.plural === 'docs') {
        relativeToRoot = relativeToRoot + '\/..';
    } else if (view.options.plural === 'modules-docs') {
        relativeToRoot = path.relative('\/docs\/' + path.join(path.dirname(view.key.replace(process.cwd(), ''))), '/');
    } else if (view.options.plural === 'docs') {
        relativeToRoot = path.relative('\/docs\/' + path.join(path.dirname(view.key.replace(/(src|test)\/tmpl\//, '').replace(process.cwd(), ''))), '/');
    }
    if (relativeToRoot !== '') {
        return relativeToRoot + '\/';
    } else {
        return '.\/';
    }
    return relativeToRoot;
}

module.exports = assemble;

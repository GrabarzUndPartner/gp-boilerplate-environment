"use strict";

var rework = require('rework');
var reworkSelectors = require('rework-mutate-selectors');
var pureGrids = require('rework-pure-grids');
var fs = require('fs');
var path = require('upath');
var reduce = require('lodash/reduce');

module.exports = function(options, featureOptions) {
    var first = true;
    return {
        name: 'base',
        generate: function() {
            var css = [];
            if (first) {
                createPureCSS({
                    originPrefix: options.prefix,
                    src: path.resolve(featureOptions.root),
                    files: [].concat(featureOptions.pureFiles || [])
                }, css);
                createColumns(options,css);
                first = false;
            }
            return css;
        }
    };
};

function createColumns(options, css) {
    css.push(rework('').use(pureGrids.units(options.columns, {
        decimals: 4,
        includeOldIEWidths: false,
        includeReducedFractions: false,
        includeWholeNumbers: false,
        selectorPrefix: '.' + options.columnPrefix + '-',
        mediaQueries: reduce(options.breakpoints, function(result, breakpoint) {
            if (breakpoint.name !== 'default') {
                result[breakpoint.name] = 'screen and (min-width: ' + breakpoint.width + ')';
            }
            return result;
        }, {})
    })).toString());
}

function createPureCSS(options, css) {
    options.files.forEach(function(file) {
        css.push(prefixFile(file, options));
    });
}

function prefixFile(file, options) {
    var data = fs.readFileSync(path.resolve(options.src, file + '.css'), 'utf8');
    var css = rework(data);
    if (options.originPrefix) {
        css.use(reworkSelectors.replace(/^\.pure/g, '.' + options.originPrefix));
    }
    css = css.toString();
    // replace font-families
    css = css.replace(/(^.*font-family.*$)/mg, '/* $1 */');
    return css;
}

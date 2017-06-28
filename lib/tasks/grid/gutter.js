"use strict";

module.exports = function(options) {
    var first = true;
    return {
        name: 'gutter',
        generate: function(breakpoint) {
            var css = [];
            var prefix = options.prefix ? options.prefix + '-' : '';
            if (breakpoint.gutter) {
                if (first) {
            css.push('.' + prefix + 'no-gutter {}');
                    css.push(createRule(options, breakpoint, prefix));
                } else {
                    css.push('@media screen and (min-width: ' + breakpoint.width + ') {', createRule(options, breakpoint, prefix), '}');
                }
            }
            first = false;
            return css;
        }
    };
};

function createRule(options, breakpoint, prefix) {
    return [
        ['[class*="' + options.columnPrefix + '-"]:not(.grid-no-gutter)',
            '.' + prefix + 'wrapper:not(.grid-no-gutter)',
            '.' + prefix + 'wrapper-fluid:not(.grid-no-gutter)',
            '.' + prefix + 'gutter'
        ].join(', '),
        '{',
        'box-sizing: border-box;',
        'padding-left: ' + breakpoint.gutter + ';',
        'padding-right: ' + breakpoint.gutter + ';',
        '}',
        '.grid-g',
        '{',
        'margin: 0 -' + breakpoint.gutter + ';',
        '}'
    ].join(' ');
}

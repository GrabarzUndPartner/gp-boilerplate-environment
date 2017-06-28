"use strict";

module.exports = function(options, featureOptions) {
    var first = true;
    return {
        name: 'visible-hidden',
        generate: function(breakpoint) {
            var css = [];
            if (first) {
                css.push(createRule(featureOptions, options.prefix + '-'));
                first = false;
            } else {
                css.push(['@media screen and (min-width: ' + breakpoint.width + ') {',
                    createRule(featureOptions, options.prefix + '-', breakpoint.name + '-'),
                    '}'
                ].join(' '));
            }
            return css;
        }
    };
};

function createRule(featureOptions, prefix, name) {
    name = name || '';
    return ['.' + prefix + name + 'visible' + ' {',
        '  display: block' + (featureOptions.important ? ' !important' : '') + ';',
        '}',
        '.' + prefix + name + 'visible-inline' + ' {',
        '  display: inline-block' + (featureOptions.important ? ' !important' : '') + ';',
        '}',
        '.' + prefix + name + 'hidden' + ' {',
        '  display: none' + (featureOptions.important ? ' !important' : '') + ';',
        '}'
    ].join(' ');
}

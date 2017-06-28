"use strict";


module.exports = function(options, featureOptions) {
    var first = true;
    return {
        name: 'wrapper',
        generate: function(breakpoint) {
            var css = [];
            if (first) {
                css.push(['.' + options.prefix + '-wrapper-fluid {',
                    'max-width: none !important;',
                    'margin-right: auto;',
                    'margin-right: auto;',
                    '}',
                    '.' + options.prefix + '-wrapper-overflow-wrap {',
                    'overflow: hidden;',
                    '}',
                    '.' + options.prefix + '-wrapper-overflow-x-wrap {',
                    'overflow-x: hidden;',
                    'overflow-y: auto;',
                    '}',
                    '.' + options.prefix + '-wrapper-overflow-y-wrap {',
                    'overflow-x: auto;',
                    'overflow-y: hidden;',
                    '}'
                ].join(' '));
                first = false;
            }

            var name = breakpoint.name;
            var wrapper = featureOptions.breakpoints.find(function(breakpoint) {
                if (breakpoint.name === name) {
                    return true;
                }
            });
            if (wrapper) {
                if (breakpoint.name === 'default') {
                    // Normal Wrapper
                    css.push(createRule(wrapper.properties, options));
                } else {
                    css.push(['@media screen and (min-width: ' + breakpoint.width + ') {',
                        createRule(wrapper.properties, options, '  '),
                        '}'
                    ].join(' '));
                }
            }
            return css;
        }
    };
};


function createRule(properties, options, spacer) {
    var rule = (spacer || '') + '.' + options.prefix + '-wrapper, .' + options.prefix + '-wrapper-fluid {';
    for (var property in properties) {
        if (properties.hasOwnProperty(property)) {
            rule += (spacer || '') + '  ' + property + ': ' + properties[property] + ';';
        }
    }
    rule += (spacer || '') + '}';
    return rule;
}

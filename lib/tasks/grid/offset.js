"use strict";

module.exports = function(options) {
    var first = true;
    return {
        name: 'offset',
        generate: function(breakpoint) {
            var css = [];
            if (first) {
                css.push(createRule(options, null));
                first = false;
            } else {
                css.push('@media screen and (min-width: ' + breakpoint.width + ') {', createRule(options, breakpoint.name), '}');
            }
            return css;
        }
    };
};

function createRule(options, name) {
    var rule = [];
    name = name ? name + '-' : '';
    for (var i = 0; i <= options.columns; i++) {
        rule.push('.' + options.columnPrefix + '-' + name + 'offset-' + i + '-' + options.columns + ' {', 'margin-left: ' + ((i / options.columns) * 100) + '\%;', '}');
    }
    return rule.join(' ');
}

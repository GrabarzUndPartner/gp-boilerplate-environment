"use strict";

module.exports = function(options) {
    return {
        name: 'variables',
        generate: function(breakpoint, nextBreakpoint) {
            var css = [];
                createMedias(options, css, breakpoint, nextBreakpoint);
            return css;
        }
    };
};

function createVar(name, value) {
    return '$' + name + ': ' + value + ';';
}

function createCustomMedia(name, value) {
    return '@custom-media ' + name + ' ' + value + ';';
}

function createMedias(options, css, breakpoint, nextBreakpoint) {
    if (breakpoint.gutter) {
        css.push(createVar('grid-gutter-' + breakpoint.name, breakpoint.gutter));
    }
    if (breakpoint.width) {
        css.push(createVar('screen-' + breakpoint.name, breakpoint.width), createCustomMedia('--screen-' + breakpoint.name, 'screen and (min-width: ' + breakpoint.width + ')'));
    } else {
        new Error('breakpoint ' + breakpoint.name + ' width undefined');
    }
    if (nextBreakpoint) {
        if (nextBreakpoint.width) {
            // substract one pixel for max width
            css.push(createCustomMedia('--screen-' + breakpoint.name + '-max', 'screen and (max-width: ' + (parseInt(nextBreakpoint.width) - (1 / (options.fontSize || 16))) + 'rem)'));
        } else {
            new Error('next breakpoint ' + nextBreakpoint.name + ' width undefined');
        }
    }
    return css;
}

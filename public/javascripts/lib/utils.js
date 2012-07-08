define(function() {
    "use strict";

    var history;
    return {
        // http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
        // modified by Stefan Reichel to fit AMD
        log: function() {
            history = history || [];
            history.push(arguments);
            if (window.console) {
                console.log(Array.prototype.slice.call(arguments));
            }
        },

        stringStartsWith: function(candidate, input) {
            return candidate.slice(0, input.length) === input;
        },

        containsObject: function(collection, obj) {
            var i;
            for (var entry in collection) {
                if (collection.hasOwnProperty(entry) && collection[entry] === obj) {
                    return true;
                }
            }

            return false;
        },

        breakPathIntoElements: function(path) {
            var elements = path.match(/(.*)[\/\\]([^\/\\]+)$/);

            return {
                "fullPath": elements[0],
                "dir": elements[1],
                "file": elements[2]
            };
        },

        degreesToRadians: function(degrees) {
            return degrees * Math.PI / 180;
        }
    };
});

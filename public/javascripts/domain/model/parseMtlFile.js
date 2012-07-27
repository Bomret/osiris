/**
 * User: Stefan Reichel
 * Date: 29.06.12
 * Time: 00:43
 */

define(["utils", "rendering"], function(utils, rendering) {
    "use strict";

    return {
        execute: function(pathToMtlFile) {
            var mtlFile = loadFile.execute(pathToMtlFile);
        }
    };
});
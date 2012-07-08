/**
 * User: Stefan Reichel
 * Date: 29.06.12
 * Time: 00:43
 */

define(["utils", "rendering", "loadFile"], function(utils, rendering, loadFile) {
    "use strict";

    return {
        execute: function(pathToMtlFile) {
            var mtlFile = loadFile.execute(pathToMtlFile);
        }
    };
});
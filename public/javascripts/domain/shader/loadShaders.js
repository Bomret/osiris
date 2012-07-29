/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:09
 */

define(["utils", "async", "loadShaderConfig", "buildShaderProgram"], function (utils, async, loadShaderConfig, buildShaderProgram) {
    "use strict";

    var _shaderCache = {};

    return {
        execute:function (shaderInformation, glContext, callback) {
            var name = shaderInformation.name;

            if (_shaderCache[name]) {
                utils.log("Found shader '" + name + "' in cache");
                callback(null, _shaderCache[name]);
            } else {
                async.waterfall([
                    function (callback) {
                        loadShaderConfig.execute(shaderInformation, glContext, callback);
                    },

                    function (shaderConfig, glContext, callback) {
                        buildShaderProgram.execute(shaderConfig, glContext, callback);
                    }
                ], callback);
            }
        }
    };
});
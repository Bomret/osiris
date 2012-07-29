/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:09
 */

define(["utils", "async", "loadShaderConfig", "buildShaderProgram"], function (utils, async, loadShaderConfig, buildShaderProgram) {
    "use strict";

    var _callback,
        _shaderCache = {};

    function _onCompleted(error, builtShaderProgram) {
        if (error) {
            _callback(error);
        }

        _shaderCache[builtShaderProgram.name] = builtShaderProgram;

        utils.log("Built shader program", builtShaderProgram);
        _callback(null, builtShaderProgram);
    }

    return {
        execute:function (shaderInformation, glContext, callback) {
            var name = shaderInformation.name;
            _callback = callback;

            if (_shaderCache[name]) {
                utils.log("Found shader '" + name + "' in cache");
                callback(null, _shaderCache[name]);
                return;
            }

            async.waterfall([
                function (callback) {
                    loadShaderConfig.execute(shaderInformation, callback);
                },
                function (downloadedShaderConfig, callback) {
                    buildShaderProgram.execute(downloadedShaderConfig, glContext, callback);
                }
            ], _onCompleted);
        }
    };
});
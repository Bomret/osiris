/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:09
 */

define(["utils", "async", "loadShaderConfig", "buildShaderProgram"], function (utils, async, loadShaderConfig, buildShaderProgram) {
    "use strict";

    var _callback,
        _name,
        _shaderCache = {};

    function _onShaderProgramBuilt(error, shaderProgram) {
        if (error) {
            _callback(error);
            return;
        }

        _shaderCache[_name] = shaderProgram;
        _callback(null, shaderProgram);
    }

    return {
        execute:function (shaderInformation, glContext, callback) {
            _name = shaderInformation.name;
            _callback = callback;

            if (_shaderCache[_name]) {
                utils.log("Found shader '" + _name + "' in cache");
                callback(null, _shaderCache[_name]);
                return;
            }

            async.waterfall([
                function (callback) {
                    loadShaderConfig.execute(shaderInformation, glContext, callback);
                },

                function (shaderConfig, glContext, callback) {
                    buildShaderProgram.execute(shaderConfig, glContext, callback);
                }
            ], _onShaderProgramBuilt);
        }
    };
});
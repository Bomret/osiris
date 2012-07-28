/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:09
 */

define(["utils", "loadShaderConfig", "buildShaderProgram"], function (utils, loadShaderConfig, buildShaderProgram) {
    "use strict";

    var _gl,
        _shaderCache = {},
        _successCallback,
        _errorCallback;

    function _onShaderConfigLoad(shaderConfig) {
        buildShaderProgram.execute(shaderConfig, _gl, {
            onSuccess:_successCallback,
            onError:_errorCallback
        });
    }

    return {
        execute:function (shaderInformation, glContext, callbacks) {
            var name = shaderInformation.name;
            _gl = glContext;
            _successCallback = callbacks.onSuccess;
            _errorCallback = callbacks.onError;

            try {
                if (_shaderCache[name]) {
                    utils.log("Shader in here");
                    _successCallback(_shaderCache[name]);
                }

                loadShaderConfig.execute(shaderInformation, {
                    onSuccess:_onShaderConfigLoad,
                    onError:_errorCallback
                });
            } catch (error) {
                _errorCallback(error);
            }
        }
    };
});
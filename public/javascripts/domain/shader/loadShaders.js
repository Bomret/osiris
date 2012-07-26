/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:09
 */

define(["utils", "jquery", "buildShaderProgram"], function (utils, $, buildShaderProgram) {
    "use strict";

    var _shaderProgramCache = {};

    /**
     *
     * @param {ShaderInformation} shaderInformation
     * @return {ShaderConfig}
     */
    var loadConfig = function (shaderInformation, loaded) {
        var pathToShaderController;

        pathToShaderController = "http://localhost:9000/shaders";
        $.ajax(pathToShaderController, {
            type:"POST",
            contentType:"application/json",
            data:JSON.stringify(shaderInformation),
            success:loaded,
            error:function (status) {
                utils.log("ERROR", status);
            }
        });
    };

    return {
        execute:function (shaderInformation, context, onDone) {
            var config,
                shaderProgram;

            utils.log("Shader to load", shaderInformation);

            loadConfig(shaderInformation, function (response) {
                config = response;
                utils.log("Shader config", response);

                if (_shaderProgramCache[config.name]) {
                    return _shaderProgramCache[config.name];
                }

                shaderProgram = buildShaderProgram.execute(config, context);
                _shaderProgramCache[config.name] = shaderProgram;

                onDone(shaderProgram);
            });
        }
    };
})
;
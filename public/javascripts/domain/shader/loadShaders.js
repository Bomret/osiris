/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:09
 */

define(["utils", "jquery", "buildShaderProgram", "rendering"], function (utils, $, ServerRequest, buildShaderProgram) {
    "use strict";

    var _shaderProgramCache = {};

    /**
     *
     * @param {ShaderInformation} shaderInformation
     * @return {ShaderConfig}
     */
    var loadConfig = function (shaderInformation, loaded) {
        var configFile,
            pathToShaderConfig;

        pathToShaderConfig = "http://localhost:9000/shaders";
        $.ajax(pathToShaderConfig, {
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
        execute:function (shaderInformation, context) {
            var config,
                pathElements,
                shaderProgram;

            utils.log("Shader to load", shaderInformation);
            loadConfig(shaderInformation, function (response) {
                utils.log("Shader config", response);
            });

            if (_shaderProgramCache[config.name]) {
                return _shaderProgramCache[config.name];
            }

            pathElements = utils.breakPathIntoElements(shaderInformation);

            // augment the config object with the loaded shader code
            config.vertexShader.code = loadShaderCode(pathElements.dir + "/" + config.vertexShader.file);
            config.fragmentShader.code = loadShaderCode(pathElements.dir + "/" + config.fragmentShader.file);

            shaderProgram = buildShaderProgram.execute(config, context);
            _shaderProgramCache[config.name] = shaderProgram;

            return shaderProgram;
        }
    };
})
;
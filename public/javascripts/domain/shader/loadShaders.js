/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:09
 */

define(["utils", "loadFile", "buildShaderProgram", "rendering"], function(utils, loadFile, buildShaderProgram, rendering) {
    "use strict";

    var _shaderProgramCache = {};

    /**
     *
     * @param pathToShaderConfig
     * @return {ShaderConfig}
     */
    var loadConfig = function(pathToShaderConfig) {
        var configFile;

        configFile = loadFile.execute(pathToShaderConfig);
        return JSON.parse(configFile);
    };

    var loadShaderCode = function(pathToShaderFile) {
        var shaderCode;

        shaderCode = loadFile.execute(pathToShaderFile);
        return shaderCode;
    };

    return {
        execute: function(pathToShaderConfig, context) {
            var config,
                pathElements,
                shaderProgram;

            config = loadConfig(pathToShaderConfig);

            utils.log("Shader config", config);

            if(_shaderProgramCache[config.name]) {
                return _shaderProgramCache[config.name];
            }

            pathElements = utils.breakPathIntoElements(pathToShaderConfig);

            // augment the config object with the loaded shader code
            config.vertexShader.code = loadShaderCode(pathElements.dir + "/" + config.vertexShader.file);
            config.fragmentShader.code = loadShaderCode(pathElements.dir + "/" + config.fragmentShader.file);

            shaderProgram = buildShaderProgram.execute(config, context);
            _shaderProgramCache[config.name] = shaderProgram;

            return shaderProgram;
        }
    };
});
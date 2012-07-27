/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:09
 */

define(["utils", "amplify", "loadShaderConfig", "buildShaderProgram"], function (utils, amplify, loadShaderConfig, buildShaderProgram) {
    "use strict";

    var _context,
        _shaderProgramCache = {};

    function _wire() {
        amplify.subscribe("osiris-shader-load", function (shaderConfig) {
            utils.log("Shader config", shaderConfig);

            buildShaderProgram.execute(shaderConfig, _context);
        });

        amplify.subscribe("osiris-shader-built", function (shaderProgram) {
            utils.log("Shader program", shaderProgram);

            amplify.publish("osiris-shader-ready", shaderProgram);
        });
    }

    return {
        execute:function (shaderInformation, context) {
            var name = shaderInformation.name;
            _context = context;

            utils.log("Shader to load", shaderInformation);

            if (_shaderProgramCache[name]) {
                amplify.publish("osiris-shader-ready", _shaderProgramCache[name]);
            }

            try {
                _wire();
                loadShaderConfig.execute(shaderInformation);
            } catch (error) {
                amplify.publish("osiris-error", error);
            }
        }
    };
})
;
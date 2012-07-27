/**
 * User: Stefan Reichel
 * Date: 30.06.12
 * Time: 16:16
 */

define(["utils", "shader", "amplify"], function (utils, shader, amplify) {
    "use strict";

    var _gl;

    var createShaderFromSource = function (type, source) {
        var glShader = _gl.createShader(type);
        _gl.shaderSource(glShader, source);
        _gl.compileShader(glShader);

        return glShader;
    };

    var createShaderProgram = function (vertexShader, fragmentShader) {
        utils.log("Shaders", vertexShader, fragmentShader);

        var program = _gl.createProgram();
        _gl.attachShader(program, vertexShader);
        _gl.attachShader(program, fragmentShader);
        _gl.linkProgram(program);

        _gl.useProgram(program);

        return program;
    };

    return {
        execute:function (config, glContext) {
            var vertexShader,
                fragmentShader,
                compiledProgram;

            _gl = glContext;

            vertexShader = createShaderFromSource(_gl.VERTEX_SHADER, config.vertexShader);
            fragmentShader = createShaderFromSource(_gl.FRAGMENT_SHADER, config.fragmentShader);
            compiledProgram = createShaderProgram(vertexShader, fragmentShader);

            amplify.publish("osiris-shader-built", new shader.ShaderProgram(config.name, compiledProgram, vertexShader, fragmentShader, config.bindables));
        }
    };
});
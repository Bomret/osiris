/**
 * User: Stefan Reichel
 * Date: 30.06.12
 * Time: 16:16
 */

define(["shader"], function(shader) {
    "use strict";

    var _gl;

    var createShaderFromSource = function(type, source) {
        var shader = _gl.createShader(type);
        _gl.shaderSource(shader, source);
        _gl.compileShader(shader);

        return shader;
    };

    var createShaderProgram = function(vertexShader, fragmentShader) {
        var program;

        program = _gl.createProgram();
        _gl.attachShader(program, vertexShader.shader);
        _gl.attachShader(program, fragmentShader.shader);
        _gl.linkProgram(program);

        _gl.useProgram(program);

        return program;
    };

    return {
        execute: function(config, glContext) {
            var vertexShader,
                fragmentShader,
                shaderProgram;

            _gl = glContext;

            shaderProgram = shader.makeShaderProgram(config);

            vertexShader = shader.makeShader(_gl.VERTEX_SHADER);
            vertexShader.shader = createShaderFromSource(_gl.VERTEX_SHADER, config.vertexShader.code);

            fragmentShader = shader.makeShader(_gl.FRAGMENT_SHADER);
            fragmentShader.shader = createShaderFromSource(_gl.FRAGMENT_SHADER, config.fragmentShader.code);

            shaderProgram.program = createShaderProgram(vertexShader, fragmentShader);
            shaderProgram.vertexShader = vertexShader;
            shaderProgram.fragmentShader = fragmentShader;

            return shaderProgram;
        }
    };
});
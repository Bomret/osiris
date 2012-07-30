/**
 * User: Stefan Reichel
 * Date: 30.06.12
 * Time: 16:16
 */

define(["utils", "shader"], function(utils, shader) {
  "use strict";

  var _gl;

  function _createShaderFromSource(type, source) {
    var glShader = _gl.createShader(type);
    _gl.shaderSource(glShader, source);
    _gl.compileShader(glShader);

    return glShader;
  }

  function _createShaderProgram(vertexShader, fragmentShader) {
    var program = _gl.createProgram();
    _gl.attachShader(program, vertexShader);
    _gl.attachShader(program, fragmentShader);
    _gl.linkProgram(program);

    _gl.useProgram(program);

    return program;
  }

  return {
    execute: function(config, glContext, callback) {
      var vertexShader,
        fragmentShader,
        compiledProgram;

      _gl = glContext;

      try {
        vertexShader = _createShaderFromSource(_gl.VERTEX_SHADER, config.vertexShader);
        fragmentShader = _createShaderFromSource(_gl.FRAGMENT_SHADER, config.fragmentShader);
        compiledProgram = _createShaderProgram(vertexShader, fragmentShader);

        callback(null, new shader.ShaderProgram(config.name, compiledProgram, vertexShader, fragmentShader, config.bindables));
      } catch (error) {
        callback(error, null);
      }
    }
  };
});
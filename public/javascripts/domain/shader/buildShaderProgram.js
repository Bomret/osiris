/**
 * Creates a shader program.
 *
 * User: Stefan Reichel
 * Date: 30.06.12
 * Time: 16:16
 */
define(["Shader", "Error"], function(Shader, Error) {
  "use strict";

  var _gl;

  /**
   * Creates a new WebGL shader of the given type from the given source code.
   *
   * @param {int} type
   * @param {String} source The source code of the shader.
   * @return {WebGLShader} The newly created shader
   * @private
   */
  function _createShaderFromSource(type, source) {
    var glShader = _gl.createShader(type);
    _gl.shaderSource(glShader, source);
    _gl.compileShader(glShader);

    return glShader;
  }

  /**
   * Creates a new WebGL shader program from the given shaders. It is automatically used.
   *
   * @param {WebGLShader} vertexShader The vertex shader of the shader program.
   * @param {WebGLShader} fragmentShader The fragment shader of the shader program.
   * @return {WebGLProgram} The new WebGL shader program.
   * @private
   */
  function _createShaderProgram(vertexShader, fragmentShader) {
    var program = _gl.createProgram();
    _gl.attachShader(program, vertexShader);
    _gl.attachShader(program, fragmentShader);
    _gl.linkProgram(program);

    _gl.useProgram(program);

    return program;
  }

  return {

    /**
     * Starts the creation of the shader program from the given shader program config. The given callback is called in case an error happens or the creation was successful. In the latter case the built shader program is handed to the callback.
     *
     * @param {Object} config The shader program configuration containing the name of the program, both shaders and the bindable attributes and uniforms.
     * @param {WebGLRenderingContext} glContext The application's WebGL context.
     * @param {Function} callback A registered callback that signals the result of the operation (error or success).
     */
    execute: function(config, glContext, callback) {
      var vertexShader,
        fragmentShader,
        compiledProgram;

      _gl = glContext;

      try {
        if (_gl.isContextLost()) {
          callback(new Error.ContextLostError());
        }

        vertexShader = _createShaderFromSource(_gl.VERTEX_SHADER, config.vertexShader);
        fragmentShader = _createShaderFromSource(_gl.FRAGMENT_SHADER, config.fragmentShader);
        compiledProgram = _createShaderProgram(vertexShader, fragmentShader);

        callback(null, new Shader.ShaderProgram(config.name, compiledProgram, vertexShader, fragmentShader, config.bindables));
      } catch (error) {
        callback(error, null);
      }
    }
  };
});
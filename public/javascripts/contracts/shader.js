/**
 * Contains shader relevant data objects.
 *
 * User: Stefan Reichel
 * Date: 30.06.12
 * Time: 17:59
 */

define(function() {
  "use strict";

  return {
    /**
     * Represents a shader program.
     *
     * @param {String} name The name of the program.
     * @param {WebGLProgram} program The actual WebGL linked shader program.
     * @param {WebGLShader} vertexShader The compiled vertex shader.
     * @param {WebGLShader} fragmentShader the compiled fragment shader.
     * @param {Object} bindables The bindable attributes and uniforms of the shader program.
     * @constructor
     */
    ShaderProgram: function(name, program, vertexShader, fragmentShader, bindables) {
      this.name = name;
      this.program = program;
      this.vertexShader = vertexShader;
      this.fragmentShader = fragmentShader;
      this.bindables = bindables;
    },

    /**
     * Represents the necessary information to query the server for a specific shader program configuration.
     *
     * @constructor
     * @param {String} name The name of the shader program
     * @param {String} file The name of the configuration file
     */
    ShaderConfigurationInformation: function(name, file) {
      this.name = name;
      this.config = file;
    }
  };
});
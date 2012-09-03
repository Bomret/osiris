/**
 * Sets up the locations of the bindable attributes and uniforms of the shader program. The renderer will use these to pass relevant information to the vertex and fragment shaders.
 *
 * User: Stefan Reichel
 * Date: 03.08.12
 * Time: 15:25
 */
define(["zepto", "async", "Error"], function($, Async, Error) {
  "use strict";

  return  {

    /**
     * Starts the setup process. The registered callback is called in case an error happens or the setup was successful. In the latter case an object containing the locations of the bound bound attributes and uniforms is handed to the callback.
     *
     * @param {WebGLProgram} shaderProgram The shader program currently used by the renderer.
     * @param {WebGLRenderingContext} glContext The application's WebGL context.
     * @param callback A registered callback that signals the result of the operation (error or success).
     */
    execute: function(shaderProgram, glContext, callback) {
      var locations = {},
        program = shaderProgram.program,
        bindables = shaderProgram.bindables;

      if (glContext.isContextLost()) {
        callback(new Error.ContextLostError());
        return;
      }

      try {
        Async.parallel([
          function() {
            $.each(bindables.attributes, function(key, attribute) {
              var attributeLocation = glContext.getAttribLocation(program, attribute);
              glContext.enableVertexAttribArray(attributeLocation);
              locations[key] = attributeLocation;
            });
          },
          function() {
            $.each(bindables.uniforms, function(key, uniform) {
              locations[key] = glContext.getUniformLocation(program, uniform);
            });
          }
        ]);

        callback(null, locations);
      } catch (error) {
        callback(error);
      }
    }
  };
});
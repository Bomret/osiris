/**
 * Sets up the WebGL context.
 *
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 13:51
 */
define(["WebGl"], function(WebGl) {
  "use strict";

  return {

    /**
     * Starts the setup of the WebGL context with the given canvas object. The given callback is called in case an error happens or the setup was successful. In the latter case the WebGL context is handed to the callback.
     *
     * @param {HTMLCanvasElement} canvas The canvas element used for rendering.
     * @param callback A registered callback that signals the result of the operation (error or success).
     */
    execute: function(canvas, callback) {
      var glContext;

      try {
        glContext = WebGl.setupWebGL(canvas);

        callback(null, glContext);
      } catch (error) {
        callback(error);
      }
    }
  };
});
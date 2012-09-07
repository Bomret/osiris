/**
 * Renders a scene.
 *
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:08
 */
define(["Log", "WebGl", "TraverseAndRender", "SetupShaderBindableLocations"], function(Log, WebGl, TraverseAndRender, SetupShaderBindableLocations) {
  "use strict";

  var _gl,
    _callback,
    _scene,
    _locations,
    _isStopped = false,
    _requestAnimationFrame = WebGl.requestAnimFrame;

  /**
   * Render loop. Traverses the scene in every iteration and renders it's contents as long as it isn't stopped.
   *
   * @private
   */
  function _drawScene() {
    if (!_isStopped) {
      _requestAnimationFrame(_drawScene);
      TraverseAndRender.execute(_scene, _gl, _locations);
    }
  }

  /**
   * Stops the rendering.
   *
   * @private
   */
  function _stopDrawing() {
    _isStopped = true;
    Log.info("Rendering stopped.");
  }

  return {

    /**
     * Starts the rendering of the given renderable scene with the given shader program. The given callback is called in case an error happens.
     *
     * @param {Object} renderableScene The scene to be rendered.
     * @param {WebGLRenderingContext} glContext The application's WebGL context.
     * @param {WebGLProgram} shaderProgram The shader program to be used to display the scene.
     * @param {Function} callback A registered callback that signals the result of the operation (error or success).
     */
    execute: function(renderableScene, glContext, shaderProgram, callback) {
      _gl = glContext;
      _scene = renderableScene;
      _callback = callback;

      SetupShaderBindableLocations.execute(shaderProgram, glContext, function(error, locations) {
        if (error) {
          return callback(error);
        }
        _locations = locations;
      });

      try {
        _drawScene();
      } catch (error) {
        callback(error);
        _stopDrawing();
      }
    }
  };
});
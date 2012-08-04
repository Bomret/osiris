/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:08
 */

define(["Utils", "WebGl", "TraverseAndRender", "SetupShaderBindableLocations"], function(Utils, WebGl, TraverseAndRender, SetupShaderBindableLocations) {
  "use strict";

  var _gl,
    _callback,
    _scene,
    _locations,
    _isStopped = false,
    _requestAnimationFrame = WebGl.requestAnimFrame;

  function _drawScene() {
    if (!_isStopped) {
      _requestAnimationFrame(_drawScene);
      TraverseAndRender.execute(_scene, _gl, _locations);
    }
  }

  function _stopDrawing() {
    _isStopped = true;
    Utils.log("Rendering stopped");
  }

  return {
    execute: function(renderableScene, glContext, shaderProgram, callback) {
      _gl = glContext;
      _scene = renderableScene;
      _callback = callback;

      try {
        SetupShaderBindableLocations.execute(glContext, shaderProgram, function(error, locations) {
          if (error) {
            callback(error);
          } else {
            _locations = locations;
          }
        });

        _drawScene();
      } catch (error) {
        callback(error);
        _stopDrawing();
      }
    }
  };
});
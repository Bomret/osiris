/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:08
 */

define(["Utils", "jquery", "MainViewModel", "WebGl", "GlMatrix", "Rendering", "FindNodes", "TraverseAndRender"], function(Utils, $, Ui, WebGl, GlMatrix, Rendering, FindNodes, TraverseAndRender) {
  "use strict";

  var _gl,
    _callback,
    _scene,
    _locations = {},
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
      var bindables = shaderProgram.bindables,
        vertexPositionAttributeLocation,
        vertexColorAttributeLocation,
        modelViewMatrixUniformLocation,
        projectionMatrixUniformLocation;

      _gl = glContext;
      _scene = renderableScene;
      _callback = callback;

      try {
        vertexPositionAttributeLocation = glContext.getAttribLocation(shaderProgram.program, bindables.attributes.vertexPosition);
        glContext.enableVertexAttribArray(vertexPositionAttributeLocation);
        _locations.vertexPositionAttributeLocation = vertexPositionAttributeLocation;

        vertexColorAttributeLocation = glContext.getAttribLocation(shaderProgram.program, bindables.attributes.vertexColor);
        _locations.vertexColorAttributeLocation = vertexColorAttributeLocation;

        modelViewMatrixUniformLocation = glContext.getUniformLocation(shaderProgram.program, bindables.uniforms.modelViewMatrix);
        _locations.modelViewMatrixUniformLocation = modelViewMatrixUniformLocation;

        projectionMatrixUniformLocation = glContext.getUniformLocation(shaderProgram.program, bindables.uniforms.projectionMatrix);
        _locations.projectionMatrixUniformLocation = projectionMatrixUniformLocation;

        _drawScene();
      } catch (error) {
        callback(error);
        _stopDrawing();
      }
    }
  };
});
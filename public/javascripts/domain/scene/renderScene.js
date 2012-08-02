/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:08
 */

define(["Utils", "jquery", "MainViewModel", "WebGl", "GlMatrix", "Rendering", "FindNodes", "TraverseScene"], function(Utils, $, Ui, WebGl, GlMatrix, Rendering, FindNodes, TraverseScene) {
  "use strict";

  var _canvas,
    _gl,
    _shaderProgram,
    _bindables,
    _callback,
    _scene,
    _vertexPositionAttributeLocation,
    _vertexColorAttributeLocation,
    _vertexNormalAttributeLocation,
    _modelViewMatrix = GlMatrix.mat4.create(),
    _modelViewMatrixUniformLocation,
    _projectionMatrix = GlMatrix.mat4.create(),
    _projectionMatrixUniformLocation,
    _normalMatrixUniformLocation,
    _isStopped = false,
    _hasChanged = true,
    _requestAnimationFrame = WebGl.requestAnimFrame;

  function _process(node) {
    if (node.type === "renderInformation") {
      _updateRenderer(node);
    } else if (node.type === "camera") {
      _updateViewport(node);
    } else if (node.type === "model") {
      _renderModel(node);
    }
  }

  function _renderModel(modelNode) {
    GlMatrix.mat4.multiply(_modelViewMatrix, modelNode.transformation);

    _gl.bindBuffer(_gl.ARRAY_BUFFER, modelNode.mesh.vertices);
    _gl.vertexAttribPointer(_vertexPositionAttributeLocation, 3, _gl.FLOAT, false, 0, 0);

    _gl.vertexAttrib4fv(_vertexColorAttributeLocation, modelNode.material.diffuseColor);

    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, modelNode.mesh.indices);
    _updateRenderMatrices();
    _gl.drawElements(_gl.TRIANGLES, modelNode.mesh.numIndices, _gl.UNSIGNED_SHORT, 0);
  }

  function _updateRenderer(renderer) {
    if (_hasChanged) {
      _updateGlInfo(renderer);
    }

    var cColor = renderer.clearColor;
    _gl.clearColor(cColor.r, cColor.g, cColor.b, cColor.a);
    _gl.clear(renderer.clear);
  }

  function _updateGlInfo(renderer) {
    $.each(renderer.options, function(key, value) {
      if (Array.isArray(value)) {
        $.each(value, function(index, val) {
          _gl[key](_gl[val]);
        });
      } else {
        _gl[key](_gl[value]);
      }
    });
  }

  function _updateViewport(node) {
    var position = node.position,
      optics = node.optics,
      aspectRatio = optics.aspectRatio;

    if (aspectRatio === "compute") {
      _canvas.width = window.innerWidth;
      _canvas.height = window.innerHeight;
      aspectRatio = _canvas.width / _canvas.height;
    }

    _gl.viewport(0, 0, _canvas.width, _canvas.height);

    if (optics.type === "perspective") {
      GlMatrix.mat4.perspective(optics.focalDistance, aspectRatio, optics.near, optics.far, _projectionMatrix);
    } else { // orthographic projection
      GlMatrix.mat4.ortho(optics.left, optics.right, optics.bottom, optics.top, optics.near, optics.far, _projectionMatrix);
    }

    GlMatrix.mat4.identity(_modelViewMatrix);
    GlMatrix.mat4.lookAt(position.eye, position.target, position.up, _modelViewMatrix);
  }

  function _updateRenderMatrices() {
    _gl.uniformMatrix4fv(_modelViewMatrixUniformLocation, false, _modelViewMatrix);
    _gl.uniformMatrix4fv(_projectionMatrixUniformLocation, false, _projectionMatrix);

    var normalMatrix = GlMatrix.mat3.create();
    GlMatrix.mat4.toInverseMat3(_modelViewMatrix, normalMatrix);
    GlMatrix.mat3.transpose(normalMatrix);
    _gl.uniformMatrix3fv(_normalMatrixUniformLocation, false, normalMatrix);
  }

  function _drawScene() {
    if (!_isStopped) {
      _requestAnimationFrame(_drawScene);
      TraverseScene.execute(_scene, _process);
      _hasChanged = false;
    }
  }

  function _stopDrawing() {
    _isStopped = true;
    Utils.log("Rendering stopped");
  }

  return {
    execute: function(renderableScene, glContext, shaderProgram, callback) {
      _gl = glContext;
      _shaderProgram = shaderProgram;
      _bindables = _shaderProgram.bindables;
      _canvas = Ui.getRenderCanvas();
      _scene = renderableScene;
      _callback = callback;

      try {
        _vertexPositionAttributeLocation = _gl.getAttribLocation(_shaderProgram.program, _bindables.attributes.vertexPosition);
        _gl.enableVertexAttribArray(_vertexPositionAttributeLocation);
        Utils.log("VertexPosition attribute location", _vertexPositionAttributeLocation);

        _vertexColorAttributeLocation = _gl.getAttribLocation(_shaderProgram.program, _bindables.attributes.vertexColor);
        Utils.log("VertexColor attribute location", _vertexColorAttributeLocation);

        //_vertexNormalAttributeLocation = _gl.getAttribLocation(_shaderProgram.program, _bindables.attributes.vertexNormal);
        //_gl.enableVertexAttribArray(_vertexNormalAttributeLocation);

        Utils.log("Matrices", _modelViewMatrix, _projectionMatrix);
        _modelViewMatrixUniformLocation = _gl.getUniformLocation(_shaderProgram.program, _bindables.uniforms.modelViewMatrix);
        Utils.log("mvMatrix uniform location", _modelViewMatrixUniformLocation);

        _projectionMatrixUniformLocation = _gl.getUniformLocation(_shaderProgram.program, _bindables.uniforms.projectionMatrix);
        Utils.log("pMatrix uniform location", _projectionMatrixUniformLocation);

        //_normalMatrixUniformLocation = _gl.getUniformLocation(_shaderProgram.program, _bindables.uniforms.normalMatrix);
        //Utils.log("nMatrix uniform location", _normalMatrixUniformLocation);

        _drawScene();
      } catch (error) {
        callback(error);
        _stopDrawing();
      }
    }
  };
});
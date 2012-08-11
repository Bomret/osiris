/**
 * User: Stefan Reichel
 * Date: 03.08.12
 * Time: 14:13
 */

define(["jquery", "MainViewModel", "GlMatrix", "TraverseScene"], function($, Ui, GlMatrix, TraverseScene) {
  "use strict";

  var _modelViewMatrixStack = [],
    _canvas,
    _gl,
    _locations,
    _modelViewMatrix = GlMatrix.mat4.create(),
    _projectionMatrix = GlMatrix.mat4.create(),
    _firstRun,
    _lookupTable = {
      "renderInformation": _updateRenderer,
      "camera": _updateViewport,
      "ambientLight": _updateAmbientLight,
      "pointLight": _updatePointLight,
      "model": _renderModel
    };

  function _pushMatrix() {
    var copy = GlMatrix.mat4.create(_modelViewMatrix);
    _modelViewMatrixStack.push(copy);
  }

  function _popMatrix() {
    if (_modelViewMatrixStack.length === 0) {
      throw "Invalid popMatrix!";
    }
    _modelViewMatrix = _modelViewMatrixStack.pop();
  }

  function _process(node) {
    var handleFunction = _lookupTable[node.type];

    if (handleFunction) {
      handleFunction(node);
    }
  }

  function _updateAmbientLight(lightNode) {
    _gl.uniform3fv(_locations.ambientLightColor, lightNode.color);
  }

  function _updatePointLight(lightNode) {
    _gl.uniform3fv(_locations.pointLightColor, lightNode.diffuseColor);
    _gl.uniform3fv(_locations.pointLightPosition, lightNode.position);
    _gl.uniform3fv(_locations.pointLightSpecularColor, lightNode.specularColor);
  }

  function _renderModel(modelNode) {
    _pushMatrix();
    GlMatrix.mat4.multiply(_modelViewMatrix, modelNode.transformation);

    _gl.bindBuffer(_gl.ARRAY_BUFFER, modelNode.mesh.vertices);
    _gl.vertexAttribPointer(_locations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);

    _gl.bindBuffer(_gl.ARRAY_BUFFER, modelNode.mesh.texCoords);
    _gl.vertexAttribPointer(_locations.vertexTexCoords, 2, _gl.FLOAT, false, 0, 0);

    _gl.bindBuffer(_gl.ARRAY_BUFFER, modelNode.mesh.normals);
    _gl.vertexAttribPointer(_locations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);

    _gl.activeTexture(_gl.TEXTURE0);
    _gl.bindTexture(_gl.TEXTURE_2D, modelNode.material.colorMap);
    _gl.uniform1i(_locations.colorMap, 0);

    _gl.activeTexture(_gl.TEXTURE1);
    _gl.bindTexture(_gl.TEXTURE_2D, modelNode.material.normalMap);
    _gl.uniform1i(_locations.normalMap, 1);

    _gl.activeTexture(_gl.TEXTURE2);
    _gl.bindTexture(_gl.TEXTURE_2D, modelNode.material.specularMap);
    _gl.uniform1i(_locations.specularMap, 2);

    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, modelNode.mesh.indices);

    _updateRenderMatrices();
    _gl.drawElements(_gl.TRIANGLES, modelNode.mesh.numIndices, _gl.UNSIGNED_SHORT, 0);
    _popMatrix();
  }

  function _updateRenderer(renderer) {
    if (_firstRun) {
      _updateGlInfo(renderer);
      _firstRun = false;
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
      _canvas.width = Math.floor(window.innerWidth * 0.9);
      _canvas.height = Math.floor(window.innerHeight * 0.9);
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
    _gl.uniformMatrix4fv(_locations.modelViewMatrix, false, _modelViewMatrix);
    _gl.uniformMatrix4fv(_locations.projectionMatrix, false, _projectionMatrix);

    var normalMatrix = GlMatrix.mat3.create();
    GlMatrix.mat4.toInverseMat3(_modelViewMatrix, normalMatrix);
    GlMatrix.mat3.transpose(normalMatrix);
    _gl.uniformMatrix3fv(_locations.normalMatrix, false, normalMatrix);
  }

  return {
    execute: function(traversableScene, glContext, locations) {
      _gl = glContext;
      _locations = locations;
      _canvas = Ui.getRenderCanvas();
      _firstRun = true;

      TraverseScene.execute(traversableScene, _process);
    }
  };
});
/**
 * User: Stefan Reichel
 * Date: 03.08.12
 * Time: 14:13
 */

define(["zepto", "MainViewModel", "GlMatrix", "TraverseScene", "Log"], function($, Ui, GlMatrix, TraverseScene, Log) {
  "use strict";

  var _modelViewMatrixStack = [],
    _canvas,
    _gl,
    _locations,
    _modelViewMatrix = GlMatrix.mat4.create(),
    _projectionMatrix = GlMatrix.mat4.create(),
    _lookupTable = {
      "renderInformation": _updateRenderer,
      "camera": _updateViewport,
      "ambientLight": _updateAmbientLight,
      "pointLight": _updatePointLight,
      "directionalLight": _updateDirectionalLight,
      "spotLight": _updateSpotlight,
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
    if (_locations.ambientLightColor) {
      _gl.uniform3fv(_locations.ambientLightColor, lightNode.color);
    }
  }

  function _updatePointLight(lightNode) {
    if (_locations.pointLightColor && _locations.pointLightPosition && _locations.pointLightSpecularColor) {
      _gl.uniform3fv(_locations.pointLightColor, lightNode.diffuseColor);
      _gl.uniform3fv(_locations.pointLightPosition, lightNode.position);
      _gl.uniform3fv(_locations.pointLightSpecularColor, lightNode.specularColor);
    }
  }

  function _updateDirectionalLight(lightNode) {
    if (_locations.directionalLightColor && _locations.directionalLightPosition && _locations.directionalLightSpecularColor) {
      _gl.uniform3fv(_locations.directionalLightColor, lightNode.diffuseColor);
      _gl.uniform3fv(_locations.directionalLightPosition, lightNode.position);
      _gl.uniform3fv(_locations.directionalLightSpecularColor, lightNode.specularColor);
    }
  }

  function _updateSpotlight(lightNode) {
    if (_locations.spotLightColor && _locations.spotLightPosition && _locations.spotLightSpecularColor && _locations.spotLightDirection && _locations.spotLightExponent && _locations.spotLightCutOff) {
      _gl.uniform3fv(_locations.spotLightColor, lightNode.diffuseColor);
      _gl.uniform3fv(_locations.spotLightPosition, lightNode.position);
      _gl.uniform3fv(_locations.spotLightSpecularColor, lightNode.specularColor);
      _gl.uniform3fv(_locations.spotLightDirection, lightNode.direction);
      _gl.uniform3fv(_locations.spotLightExponent, lightNode.exponent);
      _gl.uniform3fv(_locations.spotLightCutOff, lightNode.cutOffAngle);
    }
  }

  function _renderModel(modelNode) {
    var mesh = modelNode.mesh,
      material = modelNode.material;

    _pushMatrix();
    GlMatrix.mat4.multiply(_modelViewMatrix, modelNode.transformation);

    _gl.bindBuffer(_gl.ARRAY_BUFFER, mesh.vertices);
    _gl.vertexAttribPointer(_locations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);

    if (mesh.texCoords !== undefined && _locations.vertexTexCoords !== undefined) {
      _gl.bindBuffer(_gl.ARRAY_BUFFER, mesh.texCoords);
      _gl.vertexAttribPointer(_locations.vertexTexCoords, 2, _gl.FLOAT, false, 0, 0);
    }

    if (mesh.normals !== undefined && _locations.vertexNormal !== undefined) {
      _gl.bindBuffer(_gl.ARRAY_BUFFER, mesh.normals);
      _gl.vertexAttribPointer(_locations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);
    }

    if (material.colorMap !== undefined && _locations.colorMap !== undefined) {
      _gl.activeTexture(_gl.TEXTURE0);
      _gl.bindTexture(_gl.TEXTURE_2D, material.colorMap);
      _gl.uniform1i(_locations.colorMap, 0);
    }

    if (material.specularMap !== undefined && _locations.specularMap !== undefined) {
      _gl.activeTexture(_gl.TEXTURE1);
      _gl.bindTexture(_gl.TEXTURE_2D, material.specularMap);
      _gl.uniform1i(_locations.specularMap, 1);
    }

    _updateRenderMatrices();
    if (mesh.indices !== undefined) {
      _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, mesh.indices);
      _gl.drawElements(_gl.TRIANGLES, modelNode.mesh.numIndices, _gl.UNSIGNED_SHORT, 0);
    } else {
      _gl.drawArrays(_gl.TRIANGLES, 0, mesh.numVertices);
    }
    _popMatrix();
  }

  function _updateRenderer(renderer) {
    var cColor = renderer.clearColor;
    _gl.clearColor(cColor.r, cColor.g, cColor.b, cColor.a);
    _gl.clear(renderer.clear);
  }

  function _updateViewport(node) {
    var position = node.position,
      optics = node.optics,
      aspectRatio;

    _canvas.width = Math.floor(window.innerWidth * 0.9);
    _canvas.height = Math.floor(window.innerHeight * 0.9);
    aspectRatio = _canvas.width / _canvas.height;

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
    _gl.uniformMatrix4fv(_locations.projectionMatrix, false, _projectionMatrix);
    _gl.uniformMatrix4fv(_locations.modelViewMatrix, false, _modelViewMatrix);
  }

  return {
    execute: function(traversableScene, glContext, locations) {
      _gl = glContext;
      _locations = locations;
      _canvas = Ui.getRenderCanvas();

      if (_gl.isContextLost()) {
        throw new Error("WebGL context is lost in 'TraverseAndRender'.");
      }

      _gl.enable(_gl.DEPTH_TEST);
      _gl.enable(_gl.CULL_FACE);
      _gl.cullFace(_gl.BACK);
      _gl.frontFace(_gl.CCW);

      TraverseScene.execute(traversableScene, _process);
    }
  };
});
/**
 * Traverses and renders a scene.
 *
 * User: Stefan Reichel
 * Date: 03.08.12
 * Time: 14:13
 */
define(["zepto", "MainViewModel", "GlMatrix", "TraverseScene", "Error"], function($, Ui, GlMatrix, TraverseScene, Error) {
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

  /**
   * Saves acopy of the current model view matrix on a stack.
   *
   * @private
   */
  function _pushMatrix() {
    var copy = GlMatrix.mat4.create(_modelViewMatrix);
    _modelViewMatrixStack.push(copy);
  }

  /**
   * Pops the last current model view matrix from a stack and replaces the current one with it.
   *
   * @private
   */
  function _popMatrix() {
    if (_modelViewMatrixStack.length === 0) {
      throw "Invalid popMatrix!";
    }
    _modelViewMatrix = _modelViewMatrixStack.pop();
  }

  /**
   * Decides how to handle the given node and calls the appropriate function.
   *
   * @param {Object} node The node to be handled.
   * @private
   */
  function _process(node) {
    var handleFunction = _lookupTable[node.type];

    if (handleFunction) {
      handleFunction(node);
    }
  }

  /**
   * Updates the relevant values of the ambient light in the shaders.
   *
   * @param {Object} lightNode The ambient light node.
   * @private
   */
  function _updateAmbientLight(lightNode) {
    if (_locations.ambientLightColor) {
      _gl.uniform3fv(_locations.ambientLightColor, lightNode.color);
    }
  }

  /**
   * Updates the relevant values of the given point light in the shaders.
   *
   * @param {Object} lightNode The point light node.
   * @private
   */
  function _updatePointLight(lightNode) {
    if (_locations.pointLightColor && _locations.pointLightPosition && _locations.pointLightSpecularColor) {
      _gl.uniform3fv(_locations.pointLightColor, lightNode.diffuseColor);
      _gl.uniform3fv(_locations.pointLightPosition, lightNode.position);
      _gl.uniform3fv(_locations.pointLightSpecularColor, lightNode.specularColor);
    }
  }

  /**
   * Updates the relevant values of the given point light in the shaders.
   *
   * @param {Object} lightNode The directional light node.
   * @private
   */
  function _updateDirectionalLight(lightNode) {
    if (_locations.directionalLightColor && _locations.directionalLightPosition && _locations.directionalLightSpecularColor) {
      _gl.uniform3fv(_locations.directionalLightColor, lightNode.diffuseColor);
      _gl.uniform3fv(_locations.directionalLightPosition, lightNode.position);
      _gl.uniform3fv(_locations.directionalLightSpecularColor, lightNode.specularColor);
    }
  }

  /**
   * Updates the relevant values of the given point light in the shaders.
   *
   * @param {Object} lightNode The spot light node.
   * @private
   */
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

  /**
   * Draws the given model node.
   *
   * @param {Object} modelNode The model node
   * @private
   */
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

  /**
   * Updates the rendering information, like the clear color, with the information contained in the given node.
   *
   * @param {Object} renderingInformationNode The node containing the rendering information
   * @private
   */
  function _updateRenderer(renderingInformationNode) {
    var cColor = renderingInformationNode.clearColor;
    _gl.clearColor(cColor.r, cColor.g, cColor.b, cColor.a);
    _gl.clear(renderingInformationNode.clear);
  }

  /**
   * Updates the WebGL viewport and the canvas size to adapt to browser window resizing.
   *
   * @param {object} cameraNode The camera node.
   * @private
   */
  function _updateViewport(cameraNode) {
    var position = cameraNode.position,
      optics = cameraNode.optics,
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

  /**
   * Updates the model view and projection matrices in the shaders.
   * @private
   */
  function _updateRenderMatrices() {
    _gl.uniformMatrix4fv(_locations.projectionMatrix, false, _projectionMatrix);
    _gl.uniformMatrix4fv(_locations.modelViewMatrix, false, _modelViewMatrix);
  }

  return {

    /**
     * Starts the traversal and rendering of the given scene. The given locations object contains the locations of the bindable attributes and uniforms provided by the currently used shader program.
     *
     * @param {Object} scene The scene to be traversed and rendered.
     * @param {WebGLRenderingContext} glContext The application's WebGL context.
     * @param {Object} locations The locations of the bindable attributes and uniforms in the currently used shader program.
     */
    execute: function(scene, glContext, locations) {
      _gl = glContext;
      _locations = locations;
      _canvas = Ui.getRenderCanvas();

      if (_gl.isContextLost()) {
        throw new Error.ContextLostError();
      }

      _gl.enable(_gl.DEPTH_TEST);
      _gl.enable(_gl.CULL_FACE);
      _gl.cullFace(_gl.BACK);
      _gl.frontFace(_gl.CCW);

      TraverseScene.execute(scene, _process);
    }
  };
});
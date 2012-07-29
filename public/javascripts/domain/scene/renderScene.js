/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:08
 */

define(["utils", "jquery", "mainViewModel", "webgl", "glmatrix", "rendering", "findNodes", "traverseScene"], function (utils, $, ui, webgl, glmatrix, rendering, findNodes, traverseScene) {
    "use strict";

    var _canvas,
        _gl,
        _shaderProgram,
        _bindables,
        _successCallback,
        _errorCallback,
        _scene,
        _vertexPositionAttributeLocation,
        _vertexNormalAttributeLocation,
        _modelViewMatrix = glmatrix.mat4.create(),
        _modelViewMatrixUniformLocation,
        _projectionMatrix = glmatrix.mat4.create(),
        _projectionMatrixUniformLocation,
        _normalMatrixUniformLocation,
        _isStopped = false,
        _hasChanged = true,
        _requestAnimationFrame = webgl.requestAnimFrame;

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
        glmatrix.mat4.multiply(_modelViewMatrix, modelNode.transformation);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, modelNode.mesh.vertices);
        _gl.vertexAttribPointer(_vertexPositionAttributeLocation, 3, _gl.FLOAT, false, 0, 0);

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
        $.each(renderer.options, function (key, value) {
            if (Array.isArray(value)) {
                $.each(value, function (index, val) {
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
            glmatrix.mat4.perspective(optics.focalDistance, aspectRatio, optics.near, optics.far, _projectionMatrix);
        } else { // orthographic projection
            glmatrix.mat4.ortho(optics.left, optics.right, optics.bottom, optics.top, optics.near, optics.far, _projectionMatrix);
        }

        glmatrix.mat4.identity(_modelViewMatrix);
        glmatrix.mat4.lookAt(position.eye, position.target, position.up, _modelViewMatrix);
    }

    function _updateRenderMatrices() {
        _gl.uniformMatrix4fv(_modelViewMatrixUniformLocation, false, _modelViewMatrix);
        _gl.uniformMatrix4fv(_projectionMatrixUniformLocation, false, _projectionMatrix);

        var normalMatrix = glmatrix.mat3.create();
        glmatrix.mat4.toInverseMat3(_modelViewMatrix, normalMatrix);
        glmatrix.mat3.transpose(normalMatrix);
        _gl.uniformMatrix3fv(_normalMatrixUniformLocation, false, normalMatrix);
    }

    function _drawScene() {
        if (!_isStopped) {
            _requestAnimationFrame(_drawScene);
            traverseScene.execute(_scene, _process);
            _hasChanged = false;
        }
    }

    function _stopDrawing() {
        _isStopped = true;
        utils.log("Rendering stopped");
    }

    return {
        execute:function (renderableScene, glContext, shaderProgram, callbacks) {
            _gl = glContext;
            _shaderProgram = shaderProgram;
            _bindables = _shaderProgram.bindables;
            _canvas = ui.getRenderCanvas();
            _scene = renderableScene;
            _successCallback = callbacks.onSuccess;
            _errorCallback = callbacks.onError;

            try {
                _vertexPositionAttributeLocation = _gl.getAttribLocation(_shaderProgram.program, _bindables.attributes.vertexPosition);
                _gl.enableVertexAttribArray(_vertexPositionAttributeLocation);
                utils.log("VertexPosition uniform location", _vertexPositionAttributeLocation);

                //_vertexNormalAttributeLocation = _gl.getAttribLocation(_shaderProgram.program, _bindables.attributes.vertexNormal);
                //_gl.enableVertexAttribArray(_vertexNormalAttributeLocation);

                utils.log("Matrices", _modelViewMatrix, _projectionMatrix);
                _modelViewMatrixUniformLocation = _gl.getUniformLocation(_shaderProgram.program, _bindables.uniforms.modelViewMatrix);
                utils.log("mvMatrix uniform location", _modelViewMatrixUniformLocation);

                _projectionMatrixUniformLocation = _gl.getUniformLocation(_shaderProgram.program, _bindables.uniforms.projectionMatrix);
                utils.log("pMatrix uniform location", _projectionMatrixUniformLocation);

                //_normalMatrixUniformLocation = _gl.getUniformLocation(_shaderProgram.program, _bindables.uniforms.normalMatrix);
                //utils.log("nMatrix uniform location", _normalMatrixUniformLocation);

                _drawScene();
            } catch (error) {
                _stopDrawing();
                _errorCallback(error);
            }
        }
    };
});
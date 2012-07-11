/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:08
 */

define(["utils", "webgl", "glmatrix", "amplify", "rendering"], function (utils, webgl, glmatrix, amplify, rendering) {
    "use strict";

    var _gl,
        _bindables,
        _program,
        _socket,
        _angle,
        _scene,
        _cubeRotationNode,
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

    var _process = function (node) {
        if (node.type === "renderer") {
            _updateRenderer(node);
        } else if (node.type === "camera") {
            _updateCamera(node);
            //        } else if (node.type === "transform") {
            //            glmatrix.mat4.multiply(_modelViewMatrix, node.matrix, _modelViewMatrix);
        } else if (node.type === "rotation") {
            var transformedAxis;
            if (node.axis === "x") transformedAxis = [1, 0, 0];
            else if (node.axis === "y") transformedAxis = [0, 1, 0];
            else if (node.axis === "z") transformedAxis = [0, 0, 1];

            glmatrix.mat4.rotate(_modelViewMatrix, utils.degreesToRadians(node.angle), transformedAxis, _modelViewMatrix);
        } else if (node.type === "model") {
            _renderModel(node.model);
        }
    };

    var _renderModel = function (model) {
        _gl.bindBuffer(_gl.ARRAY_BUFFER, model.verts);
        _gl.vertexAttribPointer(_vertexPositionAttributeLocation, 3, _gl.FLOAT, false, 0, 0);
        _gl.vertexAttribPointer(_vertexNormalAttributeLocation, 3, _gl.FLOAT, false, 0, 0);

        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, model.inds);

        _updateRenderMatrices();
        _gl.drawElements(_gl.TRIANGLES, model.numIndices, _gl.UNSIGNED_SHORT, 0);
    };

    var _updateRenderer = function (renderer) {
        if (_hasChanged) {
            _updateGlInfo(renderer);
        }

        var cColor = renderer.clearColor;
        _gl.clearColor(cColor.r, cColor.g, cColor.b, cColor.a);
        _gl.clear(renderer.clear);
    };

    var _updateGlInfo = function (renderer) {
        _gl = renderer.glContext;
        _bindables = renderer.shaderProgram.bindables;
        _program = renderer.shaderProgram.program;

        _gl.useProgram(_program);

        _gl.enable(_gl.DEPTH_TEST);
        _gl.frontFace(_gl.CCW);
        _gl.cullFace(_gl.BACK);
        _gl.enable(_gl.CULL_FACE);
    };

    var _updateCamera = function (node) {
        var position = node.position;
        var optics = node.optics;

        if (optics.type === "perspective") {
            glmatrix.mat4.perspective(optics.focalDistance, optics.aspectRatio, optics.near, optics.far, _projectionMatrix);
        } else { // orthographic projection
            glmatrix.mat4.ortho(optics.left, optics.right, optics.bottom, optics.top, optics.near, optics.far, _projectionMatrix);
        }

        glmatrix.mat4.identity(_modelViewMatrix);
        glmatrix.mat4.lookAt(position.eye, position.target, position.up, _modelViewMatrix);
    };

    var _updateRenderMatrices = function () {
        _gl.uniformMatrix4fv(_modelViewMatrixUniformLocation, false, _modelViewMatrix);
        _gl.uniformMatrix4fv(_projectionMatrixUniformLocation, false, _projectionMatrix);

        var normalMatrix = glmatrix.mat3.create();
        glmatrix.mat4.toInverseMat3(_modelViewMatrix, normalMatrix);
        glmatrix.mat3.transpose(normalMatrix);
        _gl.uniformMatrix3fv(_normalMatrixUniformLocation, false, normalMatrix);
    };

    var _drawScene = function () {
        if (!_isStopped) {
            _requestAnimationFrame(_drawScene);
            _scene.traverse(_process);
            _hasChanged = false;
        }
    };

    var _stopDrawing = function () {
        _isStopped = true;
        utils.log("Rendering stopped");
    };

    return {
        execute:function (sceneDescription) {
            var renderer;

            amplify.subscribe("osiris-scene-change", function () {
                _hasChanged = true;
            });

            _scene = sceneDescription;
            _cubeRotationNode = _scene.findNodeById("rotate-cube-y");
            utils.log("Rot Node", _cubeRotationNode);

            _socket = new WebSocket("ws://localhost:9000/socket");
            utils.log("Socket", _socket);
            _socket.onmessage = function (event) {
                utils.log("Data", event.data);
                _angle = parseInt(event.data, 10);
                _cubeRotationNode.angle += _angle;
            };

            document.addEventListener("keydown", function (event) {
                if (event.keyCode === 37) {
                    _socket.send("");
                }
            }, false);

            renderer = _scene.findNodesByType("renderer")[0];
            _updateRenderer(renderer);

            _vertexPositionAttributeLocation = _gl.getAttribLocation(_program, _bindables.attributes.vertexPosition);
            _gl.enableVertexAttribArray(_vertexPositionAttributeLocation);
            utils.log("VertexPosition uniform location", _vertexPositionAttributeLocation);

            //_vertexNormalAttributeLocation = _gl.getAttribLocation(_program, _bindables.attributes.vertexNormal);
            //_gl.enableVertexAttribArray(_vertexNormalAttributeLocation);

            utils.log("Matrices", _modelViewMatrix, _projectionMatrix);
            _modelViewMatrixUniformLocation = _gl.getUniformLocation(_program, _bindables.uniforms.modelViewMatrix);
            utils.log("mvMatrix uniform location", _modelViewMatrixUniformLocation);

            _projectionMatrixUniformLocation = _gl.getUniformLocation(_program, _bindables.uniforms.projectionMatrix);
            utils.log("pMatrix uniform location", _projectionMatrixUniformLocation);

            //_normalMatrixUniformLocation = _gl.getUniformLocation(_program, _bindables.uniforms.normalMatrix);
            //utils.log("nMatrix uniform location", _normalMatrixUniformLocation);

            try {
                _drawScene();
            } catch (error) {
                alert("An error has occured during rendering. See log for details.");
                utils.log("Error", error.message);
                _stopDrawing();
            }
        }
    };
});
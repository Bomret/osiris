/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:08
 */

define(["utils", "webgl", "glmatrix", "rendering"], function (utils, webgl, glmatrix, rendering) {
    "use strict";

    var _gl,
        _bindables,
        _program,
        _socket,
        _angle,
        _scene,
        _cubeNode,
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
        } else if (node.type === "model") {
            _renderModel(node);
        }
    };

    var _renderModel = function (modelNode) {
        glmatrix.mat4.multiply(_modelViewMatrix, modelNode.transformation);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, modelNode.model.verts);
        _gl.vertexAttribPointer(_vertexPositionAttributeLocation, 3, _gl.FLOAT, false, 0, 0);
        _gl.vertexAttribPointer(_vertexNormalAttributeLocation, 3, _gl.FLOAT, false, 0, 0);

        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, modelNode.model.inds);

        _updateRenderMatrices();
        _gl.drawElements(_gl.TRIANGLES, modelNode.model.numIndices, _gl.UNSIGNED_SHORT, 0);
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
        var position = node.position,
            optics = node.optics;

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

            _scene = sceneDescription;
            _cubeNode = _scene.findNodeById("cube");
            utils.log("Cube node", _cubeNode);

            _socket = new WebSocket("ws://localhost:9000/socket");
            utils.log("Socket", _socket);
            _socket.onmessage = function (event) {
                utils.log("Data", event.data);
                //_angle = parseInt(event.data, 10);
                //glmatrix.mat4.rotateY(_cubeNode.transformation, utils.degreesToRadians(_angle), _cubeNode.transformation);
            };

            document.addEventListener("keydown", function (event) {
                if (event.keyCode === 37) {
                    _socket.send(JSON.stringify(_scene));
                }
            }, false);

            //renderer = _scene.findNodesByType("renderer")[0];
            //utils.log("Renderer", renderer);
            //_updateRenderer(renderer);

            //_vertexPositionAttributeLocation = _gl.getAttribLocation(_program, _bindables.attributes.vertexPosition);
            //_gl.enableVertexAttribArray(_vertexPositionAttributeLocation);
            //utils.log("VertexPosition uniform location", _vertexPositionAttributeLocation);

            //_vertexNormalAttributeLocation = _gl.getAttribLocation(_program, _bindables.attributes.vertexNormal);
            //_gl.enableVertexAttribArray(_vertexNormalAttributeLocation);

            //utils.log("Matrices", _modelViewMatrix, _projectionMatrix);
            //_modelViewMatrixUniformLocation = _gl.getUniformLocation(_program, _bindables.uniforms.modelViewMatrix);
            //utils.log("mvMatrix uniform location", _modelViewMatrixUniformLocation);

            //_projectionMatrixUniformLocation = _gl.getUniformLocation(_program, _bindables.uniforms.projectionMatrix);
            //utils.log("pMatrix uniform location", _projectionMatrixUniformLocation);

            //_normalMatrixUniformLocation = _gl.getUniformLocation(_program, _bindables.uniforms.normalMatrix);
            //utils.log("nMatrix uniform location", _normalMatrixUniformLocation);

            try {
                //_drawScene();
            } catch (error) {
                alert("An error has occured during rendering. See log for details.");
                utils.log("Error", error.message);
                _stopDrawing();
            }
        }
    };
});
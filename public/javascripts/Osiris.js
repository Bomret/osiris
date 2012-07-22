/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["utils", "webgl", "glmatrix", "loadObjModel", "loadShaders", "renderScene", "rendering", "scene"],
    function (utils, webgl, glmatrix, loadObjModel, loadShaders, renderScene, rendering, scene) {
        "use strict";

        var _gl,
            _canvas,
            _shaderProgram,
            _cubeScene;

        var setupWebGlContext = function (spec) {
            _canvas = document.getElementById(spec.canvasId);
            _canvas.width = spec.width || Math.floor(window.innerWidth * 0.9);
            _canvas.height = spec.height || Math.floor(window.innerHeight * 0.9);
            _gl = webgl.setupWebGL(_canvas);
        };

        return {
            init:function (specification) {
                setupWebGlContext(specification);
                utils.log("WebGl context", _gl);

                _shaderProgram = loadShaders.execute("assets/shaders/flat/flat.config", _gl);
                utils.log("ShaderProgram", _shaderProgram);

                var cameraNode = scene.makeCameraNode("cam", {
                    optics:{
                        type:"perspective",
                        focalDistance:60,
                        aspectRatio:_canvas.width / _canvas.height,
                        near:0.1,
                        far:100
                    }
                });
                var rendererNode = scene.makeRendererNode("renderer", {
                    glContext:_gl,
                    shaderProgram:_shaderProgram
                });

                //var cube = loadObjModel.execute("models/cube/cube.obj", context);
                var cube = rendering.makeCube(0.5, _gl);
                var cubeNode = scene.makeModelNode("cube", cube, glmatrix.mat4.identity());

                rendererNode.addChild(cameraNode);
                cameraNode.addChild(cubeNode);

                _cubeScene = scene.makeSceneDescription("Simple cube", rendererNode);
                utils.log("Scene", _cubeScene);

                renderScene.execute(_cubeScene);
            }
        };
    });
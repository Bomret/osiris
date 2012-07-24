/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["utils", "webgl", "glmatrix", "loadObjModel", "loadShaders", "loadScene", "renderScene"],
    function (utils, webgl, glmatrix, loadObjModel, loadShaders, loadScene, renderScene) {
        "use strict";

        var setupWebGlContext = function (spec) {
            var canvas;
            canvas = document.getElementById(spec.canvasId);
            canvas.width = spec.width || Math.floor(window.innerWidth * 0.9);
            canvas.height = spec.height || Math.floor(window.innerHeight * 0.9);

            return webgl.setupWebGL(canvas);
        };

        return {
            currentContext:null,
            currentShaderProgram:null,
            init:function (specification) {
                var shaderProgram,
                    cubeScene;

                this.currentContext = setupWebGlContext(specification);
                utils.log("WebGl context", this.currentContext);

                //this.currentShaderProgram = loadShaders.execute("assets/shaders/flat/flat.config", this.currentContext);
                //utils.log("ShaderProgram", this.currentShaderProgram);

                cubeScene = loadScene.execute("assets/scenes/simple_cube.json");
                utils.log("Scene", cubeScene);

                //renderScene.execute(cubeScene);
            }
        };
    });
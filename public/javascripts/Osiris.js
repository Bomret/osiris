/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["utils", "webgl", "glmatrix", "mainViewModel", "loadObjModel", "loadShaders", "loadScene", "renderScene", "sendMessage"],
    function (utils, webgl, glmatrix, ui, loadObjModel, loadShaders, loadScene, renderScene, sendMessage) {
        "use strict";

        var _setupWebGlContext = function (canvas) {
            canvas.width = Math.floor(window.innerWidth * 0.9);
            canvas.height = Math.floor(window.innerHeight * 0.9);

            return webgl.setupWebGL(canvas);
        };

        return {
            currentContext:null,
            currentShaderProgram:null,
            init:function () {
                ui.init(function () {
                    utils.log("Reset!");
                    this.init();
                }.bind(this));

                this.currentContext = _setupWebGlContext(ui.getRenderCanvas());
                utils.log("WebGl context", this.currentContext);

                loadShaders.execute(ui.getCurrentShader(), this.currentContext, function (shaderProgram) {
                    this.currentShaderProgram = shaderProgram;
                    utils.log("ShaderProgram", this.currentShaderProgram);
                }.bind(this));

                loadScene.execute(ui.getCurrentScene(), function (loadedScene) {
                    utils.log("Scene", loadedScene);

                    sendMessage.execute(loadedScene, function (event) {
                        window.alert(event.data);
                        //renderScene.execute(cubeScene);
                    });
                });
            }
        };
    });
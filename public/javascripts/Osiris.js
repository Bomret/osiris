/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["utils", "amplify", "webgl", "mainViewModel", "setupWebGlContext", "loadShaders", "loadScene", "renderScene", "sendMessage"],
    function (utils, amplify, webgl, ui, setupWebGlContext, loadShaders, loadScene, renderScene, sendMessage) {
        "use strict";

        function _wire(osiris) {
            amplify.subscribe("osiris-ui-change", osiris, function () {
                utils.log("Reset!");
                this.init();
            });

            amplify.subscribe("osiris-socket-message", function (event) {
                utils.log(event.data);
                //renderScene.execute(cubeScene);
            });

            amplify.subscribe("osiris-error", osiris, function (error) {
                window.alert(error.data);
            });

            amplify.subscribe("osiris-context-ready", osiris, function (context) {
                this.currentContext = context;
                utils.log("WebGl context", this.currentContext);
            });

            amplify.subscribe("osiris-shader-ready", osiris, function (shaderProgram) {
                this.currentShaderProgram = shaderProgram;
                utils.log("ShaderProgram", this.currentShaderProgram);
            });

            amplify.subscribe("osiris-scene-ready", function (loadedScene) {
                utils.log("Scene", loadedScene);
                amplify.store("scene", loadedScene);

                sendMessage.execute(loadedScene);
            });
        }

        return {
            currentContext:undefined,
            currentShaderProgram:undefined,
            execute:function () {
                ui.init();

                _wire(this);

                setupWebGlContext.execute(ui.getRenderCanvas());
                loadShaders.execute(ui.getCurrentShader(), this.currentContext);
                loadScene.execute(ui.getCurrentScene());
            }
        };
    });
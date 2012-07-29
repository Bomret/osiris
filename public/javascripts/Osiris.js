/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["utils", "webgl", "async", "mainViewModel", "setupWebGlContext", "loadShaders", "loadScene", "renderScene", "sendMessage"],
    function (utils, webgl, async, ui, setupWebGlContext, loadShaders, loadScene, renderScene, sendMessage) {
        "use strict";

        function _handleError(error) {
            ui.updateStatus("error", "An error occured: " + error.message + " See console for details.");
            utils.log("ERROR", error.stack);
        }

        function _onGlContextCreate(error, glContext) {
            if (error) {
                _handleError(error);
            } else {
                utils.log("WebGl context", glContext);

                async.parallel({
                    shaderProgram:function (callback) {
                        loadShaders.execute(ui.getCurrentShader(), glContext, callback);
                    },
                    loadedScene:function (callback) {
                        loadScene.execute(ui.getCurrentScene(), glContext, callback);
                    }
                }, function (error, results) {
                    if (error) {
                        _handleError(error);
                    } else {
                        ui.updateStatus("info", "Loaded selected shader program and scene.");
                        utils.log("Loaded scene and shaders", results);
                        //renderScene.execute(results.loadedScene, glContext, results.shaderProgram, );
                    }
                });
            }
        }

        return {
            execute:function () {
                ui.init(function () {
                    utils.log("Reset!");
                    ui.updateStatus("info", "Resetting...");
                    this.execute();
                }.bind(this));

                ui.updateStatus("info", "Setting up WebGL context...");
                setupWebGlContext.execute(ui.getRenderCanvas(), _onGlContextCreate);
            }
        };
    });
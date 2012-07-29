/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["utils", "webgl", "async", "mainViewModel", "setupWebGlContext", "loadShaders", "loadScene", "renderScene"],
    function (utils, webgl, async, ui, setupWebGlContext, loadShaders, loadScene, renderScene) {
        "use strict";

        var _scene;

        function _onComplete(error, results) {
            if(error) {
                ui.updateStatus("error", "An error occured: '" + error.message + "' See console log for details.");
                utils.log("ERROR", error.stack);
                return;
            }

            utils.log("RESULTS", results);
            _scene = results.loadedScene;
        }

        return {
            execute:function () {
                ui.init(function () {
                    ui.updateStatus("info", "Reloading...");
                    utils.log("Reset!", ui.getCurrentShader(), ui.getCurrentScene());

                    this.execute();
                }.bind(this));

                async.auto({
                        glContext:function (callback) {
                            ui.updateStatus("info", "Setting up WebGL context...");
                            setupWebGlContext.execute(ui.getRenderCanvas(), callback);
                        },
                        loadedScene:["glContext", function (callback, results) {
                            ui.updateStatus("info", "Loading selected scene...");
                            loadScene.execute(ui.getCurrentScene(), results.glContext, callback);
                        }],

                        loadedShaderProgram:["glContext", function (callback, results) {
                            ui.updateStatus("info", "Loading selected shader program...");
                            loadShaders.execute(ui.getCurrentShader(), results.glContext, callback);
                        }],
                        renderScene:["loadedScene", "loadedShaderProgram", function (callback, results) {
                            ui.updateStatus("info", "Rendering...");
                            renderScene.execute(results.loadedScene, results.glContext, results.loadedShaderProgram, callback);
                        }]
                    },
                    _onComplete);
            }
        };
    }
);
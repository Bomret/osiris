/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["utils", "webgl", "async", "mainViewModel", "setupWebGlContext", "loadShaders", "loadScene", "renderScene"],
    function (utils, webgl, async, ui, setupWebGlContext, loadShaders, loadScene, renderScene) {
        "use strict";

        var _gl;

        function _onGlContextCreate(error, glContext) {
            if (error) {
                _handleError(error);
                return;
            }

            ui.updateStatus("info", "Created WebGL context.");
            utils.log("WebGL context", glContext);

            _gl = glContext;
            _loadSelectedShaderProgramAndScene(glContext);
        }

        function _loadSelectedShaderProgramAndScene(glContext) {
            ui.updateStatus("info", "Loading selected shader program and scene...");

            async.parallel({
                shaderProgram:function (callback) {
                    loadShaders.execute(ui.getCurrentShader(), glContext, callback);
                },
                loadedScene:function (callback) {
                    loadScene.execute(ui.getCurrentScene(), glContext, callback);
                }
            }, _onSelectedShaderProgramAndSceneLoaded);
        }

        function _onSelectedShaderProgramAndSceneLoaded(error, results) {
            if (error) {
                _handleError(error);
                return;
            }

            ui.updateStatus("info", "Loaded selected shader program and scene.");
            utils.log("Loaded scene and shaders", results);

            renderScene.execute(results.loadedScene, _gl, results.shaderProgram, _handleError);
        }

        function _handleError(error) {
            ui.updateStatus("error", "An error occured: '" + error.message + "' See console log for details.");
            utils.log("ERROR", error.stack);
        }

        return {
            execute:function () {
                ui.init(function () {
                    ui.updateStatus("info", "Reloading...");
                    utils.log("Reset!");

                    this.execute();
                }.bind(this));

                ui.updateStatus("info", "Setting up WebGL context...");
                setupWebGlContext.execute(ui.getRenderCanvas(), _onGlContextCreate);
            }
        };
    }
);
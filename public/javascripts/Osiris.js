/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["utils", "webgl", "mainViewModel", "setupWebGlContext", "loadShaders", "loadScene", "renderScene", "sendMessage"],
    function (utils, webgl, ui, setupWebGlContext, loadShaders, loadScene, renderScene, sendMessage) {
        "use strict";

        var _gl,
            _shaderProgram;

        function _onGlContextCreate(glContext) {
            _gl = glContext;
            utils.log("WebGl context", _gl);

            loadShaders.execute(ui.getCurrentShader(), _gl, {
                onSuccess:_onShaderProgramBuilt,
                onError:_onError
            });

            loadScene.execute(ui.getCurrentScene(), _gl, {
                onSuccess:_onSceneLoad,
                onError:_onError
            });
        }

        function _onShaderProgramBuilt(shaderProgram) {
            _shaderProgram = shaderProgram;
            utils.log("Shader program", _shaderProgram);
        }

        function _onSceneLoad(loadedScene) {
            utils.log("Scene", loadedScene);
            renderScene.execute(loadedScene, _gl, _shaderProgram, {
                onSuccess:undefined,
                onError:_onError
            });
        }

        function _onError(error) {
            utils.log("ERROR", error.stack);
        }

        return {
            execute:function () {
                ui.init(function () {
                    utils.log("Reset!");
                    this.execute();
                }.bind(this));

                setupWebGlContext.execute(ui.getRenderCanvas(), {
                    onSuccess:_onGlContextCreate,
                    onError:_onError
                });
            }
        };
    });
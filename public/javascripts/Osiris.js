/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["Utils", "async", "MainViewModel", "SetupWebGlContext", "LoadShaders", "LoadScene", "RenderScene", "SetupKeyboardHandling"], function (Utils, Async, Ui, SetupWebGlContext, LoadShaders, LoadScene, RenderScene, SetupKeyboardHandling) {
    "use strict";

    function _handleError(error) {
        Ui.updateStatus("error", "An error occurred: '" + error.message + "' See console log for details.");
        Utils.log("ERROR", error.stack);
    }

    function _onSetupComplete(error, results) {
        if (error) {
            _handleError(error);
        } else {
            Ui.updateStatus("info", "Setting up keyboard handling...");
            SetupKeyboardHandling.execute(results.loadedScene, {
                87:{ // w
                    nodeId:"cube",
                    type:"ApplyImpulse",
                    data:[0, 5, 0]
                },
                83:{ // s
                    nodeId:"cube",
                    type:"ApplyImpulse",
                    data:[0, -5, 0]
                },
                68:{ // d
                    nodeId:"cube",
                    type:"ApplyImpulse",
                    data:[5, 0, 0]
                },
                65:{ // a
                    nodeId:"cube",
                    type:"ApplyImpulse",
                    data:[-5, 0, 0]
                },
                74:{ // j
                    nodeId:"cube",
                    type:"ApplyImpulse",
                    data:[0, 0, 5]
                },
                73:{ // i
                    nodeId:"cube",
                    type:"ApplyImpulse",
                    data:[0, 0, -5]
                }
            }, _handleError);

            Ui.updateStatus("info", "Rendering...");
            RenderScene.execute(results.loadedScene, results.glContext, results.loadedShaderProgram, _handleError);
        }
    }

    return {
        execute:function () {
            Ui.init(function () {
                Ui.updateStatus("info", "Reloading...");
                Utils.log("Reset!", Ui.getCurrentShader(), Ui.getCurrentScene());

                this.execute();
            }.bind(this));

            Async.auto({
                    glContext:function (callback) {
                        Ui.updateStatus("info", "Setting up WebGL context...");
                        SetupWebGlContext.execute(Ui.getRenderCanvas(), callback);
                    },
                    loadedScene:["glContext", function (callback, results) {
                        Ui.updateStatus("info", "Loading selected Scene...");
                        LoadScene.execute(Ui.getCurrentScene(), results.glContext, callback);
                    }],
                    loadedShaderProgram:["glContext", function (callback, results) {
                        Ui.updateStatus("info", "Loading selected shader program...");
                        LoadShaders.execute(Ui.getCurrentShader(), results.glContext, callback);
                    }]
                },
                _onSetupComplete);
        }
    };
});
/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["utils", "webgl", "async", "mainViewModel", "setupWebGlContext", "loadShaders", "loadScene", "sendMessage", "renderScene"],
  function(utils, webgl, async, ui, setupWebGlContext, loadShaders, loadScene, sendMessage, renderScene) {
    "use strict";

    var _scene;

    function _onSetupComplete(error, results) {
      if (error) {
        _handleError(error);
      } else {
        utils.log("RESULTS", results);
        _scene = results.loadedScene;

        ui.updateStatus("info", "Rendering...");
        renderScene.execute(results.loadedScene, results.glContext, results.loadedShaderProgram, _handleError);
      }
    }

    function _handleError(error) {
      ui.updateStatus("error", "An error occured: '" + error.message + "' See console log for details.");
      utils.log("ERROR", error.stack);
    }

    return {
      execute: function() {
        ui.init(function() {
          ui.updateStatus("info", "Reloading...");
          utils.log("Reset!", ui.getCurrentShader(), ui.getCurrentScene());

          this.execute();
        }.bind(this));

        async.auto({
            glContext: function(callback) {
              ui.updateStatus("info", "Setting up WebGL context...");
              setupWebGlContext.execute(ui.getRenderCanvas(), callback);
            },
            loadedScene: ["glContext", function(callback, results) {
              ui.updateStatus("info", "Loading selected scene...");
              loadScene.execute(ui.getCurrentScene(), results.glContext, callback);
            }],
            loadedShaderProgram: ["glContext", function(callback, results) {
              ui.updateStatus("info", "Loading selected shader program...");
              loadShaders.execute(ui.getCurrentShader(), results.glContext, callback);
            }]
          },
          _onSetupComplete);
      }
    };
  }
);
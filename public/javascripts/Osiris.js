/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["Log", "async", "MainViewModel", "SetupWebGlContext", "LoadShaders", "LoadScene", "RenderScene", "HandleUserInput"], function(Log, Async, Ui, SetupWebGlContext, LoadShaders, LoadScene, RenderScene, HandleUserInput) {
  "use strict";

  function _handleError(error) {
    Ui.updateStatus("error", "An error occurred: '" + error.message + "' See console log for details.");
    Log.error("ERROR", error.stack);
  }

  function _onSetupComplete(error, results) {
    if (error) {
      return _handleError(error);
    }

    Ui.updateStatus("info", "Setting up user input handling...");
    Log.info("Setting up user input handling...");
    HandleUserInput.execute(results.loadedScene, _handleError);

    Ui.updateStatus("info", "Rendering...");
    Log.info("Rendering...");
    RenderScene.execute(results.loadedScene, results.glContext, results.loadedShaderProgram, _handleError);
  }

  return {
    init: function() {
      Ui.init(function() {
        Ui.updateStatus("info", "Starting...");
        Log.info("Starting...", Ui.getCurrentShader(), Ui.getCurrentScene());

        this.execute();
      }.bind(this));
    },

    execute: function() {
      Async.auto({
          glContext: function(callback) {
            Ui.updateStatus("info", "Setting up WebGL context...");
            Log.info("Setting up WebGL context...");
            SetupWebGlContext.execute(Ui.getRenderCanvas(), callback);
          },
          loadedScene: ["glContext", function(callback, results) {
            Ui.updateStatus("info", "Loading selected Scene...");
            Log.info("Loading selected scene...");
            LoadScene.execute(Ui.getCurrentScene(), results.glContext, callback);
          }],
          loadedShaderProgram: ["glContext", function(callback, results) {
            Ui.updateStatus("info", "Loading selected shader program...");
            Log.info("Loading selected shader program...");
            LoadShaders.execute(Ui.getCurrentShader(), results.glContext, callback);
          }]
        },
        _onSetupComplete);
    }
  };
});
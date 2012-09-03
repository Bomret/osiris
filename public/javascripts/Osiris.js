/**
 * The main module of the Osiris renderer. It coordinates the main operations and interacts with the HTML page.
 *
 * User: Stefan Reichel
 * Date: 13.06.12
 * Time: 13:37
 */
define(["Log", "async", "MainViewModel", "SetupWebGlContext", "LoadShaderProgram", "LoadScene", "RenderScene", "HandleUserInput"], function(Log, Async, Ui, SetupWebGlContext, LoadShaderProgram, LoadScene, RenderScene, HandleUserInput) {
  "use strict";

  /**
   * Handles incoming errors by displaying them in the status output and logging theit stack, if available.
   *
   * @param {Error} error A possible error.
   * @private
   */
  function _handleError(error) {
    Ui.updateStatus("error", "An error occurred: '" + error.message + "' See console log for details.");

    if (error.stack) {
      Log.error("ERROR", error.stack);
    }
  }

  /**
   * Executes the Input handling and scene rendering after all setup steps are done. If an error occured during those it is printed on screen.
   *
   * @param {Error} error A possible error.
   * @param {Object} results The results from the setup processes.
   * @private
   */
  function _onSetupComplete(error, results) {
    if (error) {
      _handleError(error);
      return;
    }

    Ui.updateStatus("info", "Setting up user input handling...");
    Log.info("Setting up user input handling...");
    HandleUserInput.execute(results.loadedScene, _handleError);

    Ui.updateStatus("info", "Rendering...");
    Log.info("Rendering...");
    RenderScene.execute(results.loadedScene, results.glContext, results.loadedShaderProgram, _handleError);
  }

  return {

    /**
     * Initializes the Osiris renderer.
     */
    init: function() {
      Ui.init(function() {
        Ui.updateStatus("info", "Starting...");
        Log.info("Starting...", Ui.getCurrentShader(), Ui.getCurrentScene());

        this.execute();
      }.bind(this));
    },

    /**
     * Starts the Osiris renderer. First everything necessary will be setup an then it will be rendered. If an error occurs, the application stops and displays it on screen.
     */
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
            LoadShaderProgram.execute(Ui.getCurrentShader(), results.glContext, callback);
          }]
        },
        _onSetupComplete);
    }
  };
});
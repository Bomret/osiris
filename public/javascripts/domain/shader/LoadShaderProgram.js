/**
 * Loads a shader program.
 *
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:09
 */
define(["Log", "async", "DownloadShaderConfigFromServer", "BuildShaderProgram"], function(Log, Async, DownloadShaderConfigFromServer, BuildShaderProgram) {
  "use strict";

  var _callback;

  /**
   * Executes the module's registered callback with either an occurred error or the results of the operation.
   *
   * @param {Error} error A possible error.
   * @param {Object} builtShaderProgram The finished shader program.
   * @private
   */
  function _onComplete(error, builtShaderProgram) {
    if (error) {
      _callback(error);
      return;
    }
    _callback(null, builtShaderProgram);
  }

  return {

    /**
     * Starts loading the shader program described by the given shaderInformation. The given callback is called in case an error happens or the loading was successful. In the latter case the finished shader program is handed to the callback.
     *
     * @param {ShaderConfigurationInformation} shaderInformation Information describing the shader configuration so the server knows which one to deliver.
     * @param {WebGLRenderingContext} glContext The application's WebGL context.
     * @param {Function} callback A registered callback that signals the result of the operation (error or success).
     */
    execute: function(shaderInformation, glContext, callback) {
      _callback = callback;

      Async.waterfall([
        function(callback) {
          Log.info("Downloading shader configuration '" + shaderInformation.name + "'...");
          DownloadShaderConfigFromServer.execute(shaderInformation, callback);
        },
        function(downloadedShaderConfig, callback) {
          Log.info("Building shader program...");
          BuildShaderProgram.execute(downloadedShaderConfig, glContext, callback);
        }
      ], _onComplete);
    }
  };
});
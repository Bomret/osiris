/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:09
 */

define(["Log", "async", "DownloadShaderConfigFromServer", "BuildShaderProgram"], function(Log, Async, DownloadShaderConfigFromServer, BuildShaderProgram) {
  "use strict";

  var _callback;

  function _onComplete(error, builtShaderProgram) {
    if (error) {
      _callback(error);
    } else {
      _callback(null, builtShaderProgram);
    }
  }

  return {
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
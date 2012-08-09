/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 21:09
 */

define(["Utils", "async", "LoadShaderConfig", "BuildShaderProgram"], function(Utils, Async, LoadShaderConfig, BuildShaderProgram) {
  "use strict";

  var _callback;

  function _onComplete(error, builtShaderProgram) {
    if (error) {
      _callback(error);
    } else {
      Utils.log("Built shader program", builtShaderProgram);
      _callback(null, builtShaderProgram);
    }
  }

  return {
    execute: function(shaderInformation, glContext, callback) {
      _callback = callback;

      Async.waterfall([
        function(callback) {
          Utils.log("Exec LoadShaderConfig");
          LoadShaderConfig.execute(shaderInformation, callback);
        },
        function(downloadedShaderConfig, callback) {
          Utils.log("Exec BuildShaderProgram", downloadedShaderConfig);
          BuildShaderProgram.execute(downloadedShaderConfig, glContext, callback);
        }
      ], _onComplete);
    }
  };
});
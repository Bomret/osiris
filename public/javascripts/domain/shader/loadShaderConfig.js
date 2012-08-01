/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 12:23
 */

define(["jquery"], function($) {
  "use strict";

  var _pathToShaderController = "http://localhost:9000/shaders";

  return {
    execute: function(shaderInformation, callback) {
      $.ajax({
        url: _pathToShaderController,
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(shaderInformation),
        success: function(shaderConfig) {
          callback(null, shaderConfig);
        },
        error: function(error) {
          callback(error, null);
        }
      });
    }
  };
});
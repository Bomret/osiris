/**
 * Downloads a shader configuration from the Osiris server.
 *
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 12:23
 */

define(["zepto"], function($) {
  "use strict";

  var _pathToShaderController = "/shaders";

  return {

    /**
     * Starts the download of the shader configuration described by the given shaderInformation. The given callback is called in case an error happens or the download was successful. In the latter case the downloaded shader configuration is handed to the callback.
     *
     * @param {ShaderConfigurationInformation} shaderInformation Information describing the shader configuration so the server knows which one to deliver.
     * @param {Function} callback A registered callback that signals the result of the operation (error or success).
     */
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
          callback(error);
        }
      });
    }
  };
});
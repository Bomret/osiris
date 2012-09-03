/**
 * Downloads a scene from the Osiris server.
 *
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 13:18
 */
define(["zepto"], function($) {
  "use strict";

  var _pathToSceneController = "/scenes";

  return {

    /**
     * Starts the download of the scene described by the given sceneInformation. The given callback is called in case an error happens or the download was successful. In the latter case the downloaded scene is handed to the callback.
     *
     * @param {SceneInformation} sceneInformation Information describing the scene so the server knows which one to deliver.
     * @param {Function} callback A registered callback that signals the result of the operation (error or success).
     */
    execute: function(sceneInformation, callback) {
      $.ajax({
        url: _pathToSceneController,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(sceneInformation),
        success: function(loadedScene) {
          callback(null, loadedScene);
        },
        error: function(error) {
          callback(error);
        }
      });
    }
  };
});
/**
 * Loads a scene and prepares it for rendering.
 *
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 16:21
 */

define(["Log", "async", "DownloadSceneFromServer", "PrepareSceneForRendering"], function(Log, Async, DownloadSceneFromServer, PrepareSceneForRendering) {
  "use strict";

  var _callback;

  /**
   * Executes the module's registered callback with either an occurred error or the results of the operation.
   *
   * @param {Error} error A possible error.
   * @param {Object} preparedScene The loaded scene, ready for rendering.
   * @private
   */
  function _onComplete(error, preparedScene) {
    if (error) {
      _callback(error);
      return;
    }
    _callback(null, preparedScene);
  }

  return {

    /**
     * Starts loading the scene described by the given sceneInformation. The given callback is called in case an error happens or the loading was successful. In the latter case the finished scene is handed to the callback.
     *
     * @param {SceneInformation} sceneInformation Information describing the scene so the server knows which one to deliver.
     * @param {WebGLRenderingContext} glContext The application's WebGL context.
     * @param {Function} callback A registered callback that signals the result of the operation (error or success).
     */
    execute: function(sceneInformation, glContext, callback) {
      _callback = callback;

      Async.waterfall([
        function(callback) {
          Log.info("Downloading scene '" + sceneInformation.name + "'...");
          DownloadSceneFromServer.execute(sceneInformation, callback);
        },
        function(downloadedScene, callback) {
          Log.info("Preparing the scene for rendering");
          PrepareSceneForRendering.execute(downloadedScene, glContext, callback);
        }
      ], _onComplete);
    }
  };
});

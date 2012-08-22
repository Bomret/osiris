/**
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 16:21
 */

define(["Log", "async", "DownloadSceneFromServer", "PrepareSceneForRendering"], function(Log, Async, DownloadSceneFromServer, PrepareSceneForRendering) {
  "use strict";

  var _callback;

  function _onComplete(error, preparedScene) {
    if (error) {
      return _callback(error);
    }
    _callback(null, preparedScene);
  }

  return {

    /**
     *
     *
     * @param {SceneInformation} sceneInformation
     * @param {WebGLContext} glContext
     * @param {Function} callback
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

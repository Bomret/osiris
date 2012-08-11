/**
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 16:21
 */

define(["Utils", "async", "DownloadSceneFromServer", "PrepareSceneForRendering"], function(Utils, Async, DownloadSceneFromServer, PrepareSceneForRendering) {
  "use strict";

  var _callback;

  function _onComplete(error, preparedScene) {
    if (error) {
      _callback(error);
    } else {
      Utils.log("Prepared scene", preparedScene);
      _callback(null, preparedScene);
    }
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
          DownloadSceneFromServer.execute(sceneInformation, callback);
        },
        function(downloadedScene, callback) {
          PrepareSceneForRendering.execute(downloadedScene, glContext, callback);
        }
      ], _onComplete);
    }
  };
});

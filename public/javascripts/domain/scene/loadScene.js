/**
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 16:21
 */

define(["Utils", "async", "DownloadSceneFromServer", "PrepareSceneForRendering"], function(Utils, Async, DownloadSceneFromServer, PrepareSceneForRendering) {
  "use strict";

  var _sceneCache = {},
    _callback;

  function _onComplete(error, preparedScene) {
    if (error) {
      _callback(error);
    } else {
      _sceneCache[preparedScene.name] = preparedScene;

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
      var name = sceneInformation.name;
      _callback = callback;

      if (_sceneCache[name]) {
        Utils.log("Scene '" + name + "' found in cache");
        callback(null, _sceneCache[name]);
        return;
      }

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

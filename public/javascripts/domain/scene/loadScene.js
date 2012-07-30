/**
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 16:21
 */

define(["utils", "async", "downloadSceneFromServer", "prepareSceneForRendering"], function(utils, async, downloadSceneFromServer, prepareSceneForRendering) {
  "use strict";

  var _sceneCache = {},
    _callback;

  function _onComplete(error, preparedScene) {
    if (error) {
      _callback(error);
    } else {
      _sceneCache[preparedScene.name] = preparedScene;

      utils.log("Prepared scene", preparedScene);
      _callback(null, preparedScene);
    }
  }

  return {
    execute: function(sceneInformation, glContext, callback) {
      var name = sceneInformation.name;
      _callback = callback;

      if (_sceneCache[name]) {
        utils.log("Scene '" + name + "' found in cache");
        callback(null, _sceneCache[name]);
        return;
      }

      async.waterfall([
        function(callback) {
          downloadSceneFromServer.execute(sceneInformation, callback);
        },
        function(downloadedScene, callback) {
          prepareSceneForRendering.execute(downloadedScene, glContext, callback);
        }
      ], _onComplete);
    }
  };
});

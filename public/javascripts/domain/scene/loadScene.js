/**
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 16:21
 */

define(["utils", "async", "loadSceneFromServer", "prepareSceneForRendering"], function (utils, async, loadSceneFromServer, prepareSceneForRendering) {
    "use strict";

    var _callback,
        _name,
        _sceneCache = {};

    function _onScenePrepared(error, preparedScene) {
        if (error) {
            _callback(error);
            return;
        }

        _sceneCache[_name] = preparedScene;
        _callback(null, preparedScene);
    }

    return {
        execute:function (sceneInformation, glContext, callback) {
            _name = sceneInformation.name;
            _callback = callback;

            if (_sceneCache[_name]) {
                utils.log("Scene '" + _name + "' found in cache", _sceneCache[_name]);
                callback(null, _sceneCache[_name]);
                return;
            }

            async.waterfall([
                function (callback) {
                    loadSceneFromServer.execute(sceneInformation, glContext, callback);
                },
                function (loadedScene, glContext, callback) {
                    prepareSceneForRendering.execute(loadedScene, glContext, callback);
                }
            ], _onScenePrepared);
        }
    };
});

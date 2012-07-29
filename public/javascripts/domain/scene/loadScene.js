/**
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 16:21
 */

define(["utils", "async", "loadSceneFromServer", "prepareSceneForRendering"], function (utils, async, loadSceneFromServer, prepareSceneForRendering) {
    "use strict";

    var _sceneCache = {};

    return {
        execute:function (sceneInformation, glContext, callback) {
            var name = sceneInformation.name;

            if (_sceneCache[name]) {
                utils.log("Scene '" + name + "' found in cache", _sceneCache[name]);
                callback(null, _sceneCache[name]);
            } else {
                async.waterfall([
                    function (asyncCallback) {
                        utils.log("Exec loadSceneFromServer");
                        loadSceneFromServer.execute(sceneInformation, glContext, callback);
                    },
                    function (loadedScene, glContext, asyncCallback) {
                        utils.log("Exec prepareSceneForRendering");
                        prepareSceneForRendering.execute(loadedScene, glContext, callback);
                    }
                ], function (error, results) {
                    if (error) {
                        callback(error);
                    }
                    utils.log("LoadScene results", results);
                    callback(null, results[0]);
                });
            }
        }
    };
});

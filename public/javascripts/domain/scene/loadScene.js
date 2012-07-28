/**
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 16:21
 */

define(["utils", "loadSceneFromServer", "prepareSceneForRendering"], function (utils, loadSceneFromServer, prepareSceneForRendering) {
    "use strict";

    var _name,
        _gl,
        _successCallback,
        _errorCallback,
        _sceneCache = {};

    function _onSceneLoad(loadedScene) {
        utils.log("Loaded scene", loadedScene);
        prepareSceneForRendering.execute(loadedScene, _gl, {
            onSuccess:_onScenePrepare,
            onError:_errorCallback
        });
    }

    function _onScenePrepare(preparedScene) {
        utils.log("Prepared scene", preparedScene);
        _sceneCache[_name] = preparedScene;
        _successCallback(preparedScene);
    }

    return {
        execute:function (sceneInformation, glContext, callbacks) {
            _name = sceneInformation.name;
            _gl = glContext;
            _successCallback = callbacks.onSuccess;
            _errorCallback = callbacks.onError;

            try {
                if (_sceneCache[_name]) {
                    utils.log("Scene in here", _sceneCache[_name]);
                    _successCallback(_sceneCache[_name]);
                }

                loadSceneFromServer.execute(sceneInformation, {
                    onSuccess:_onSceneLoad,
                    onError:_errorCallback
                });
            } catch (error) {
                _errorCallback(error);
            }
        }
    };
});

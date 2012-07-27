/**
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 16:21
 */

define(["utils", "amplify", "loadSceneFromServer"], function (utils, amplify, loadSceneFromServer) {
    "use strict";

    var _name,
        _sceneCache = {};

    function _wire() {
        amplify.subscribe("osiris-scene-load", function (loadedScene) {
            utils.log("Loaded scene", loadedScene);
            _sceneCache[_name] = loadedScene;
            amplify.publish("osiris-scene-ready", loadedScene);
        });
    }

    return {
        execute:function (sceneInformation) {
            _name = sceneInformation.name;
            utils.log("Scene to load", sceneInformation);

            if (_sceneCache[_name]) {
                amplify.publish("osiris-scene-ready", _sceneCache[_name]);
            }

            try {
                _wire();
                loadSceneFromServer.execute(sceneInformation);
            } catch (error) {
                amplify.publish("osiris-error", error);
            }
        }
    };
});

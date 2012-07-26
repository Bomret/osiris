/**
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 16:21
 */

define(["utils", "jquery"], function (utils, $, buildShaderProgram) {
    "use strict";

    var _sceneCache = {};

    function _loadSceneFromServer(sceneInformation, loaded) {
        var pathToSceneController;

        pathToSceneController = "http://localhost:9000/scenes";
        $.ajax(pathToSceneController, {
            type:"POST",
            contentType:"application/json",
            data:JSON.stringify(sceneInformation),
            success:loaded,
            error:function (status) {
                utils.log("ERROR", status);
            }
        });
    }

    return {
        execute:function (sceneInformation, onDone) {
            utils.log("Scene to load", sceneInformation);

            _loadSceneFromServer(sceneInformation, function (response) {
                onDone(response);
            });
        }
    };
});

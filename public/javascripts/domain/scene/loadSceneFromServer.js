/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 13:18
 */

define(["utils", "jquery"], function (utils, $) {
    "use strict";

    var _pathToSceneController = "http://localhost:9000/scenes";

    return {
        execute:function (sceneInformation, callbacks) {
            try {
                $.ajax({
                    url:_pathToSceneController,
                    type:"POST",
                    dataType:"json",
                    contentType:"application/json",
                    data:JSON.stringify(sceneInformation),
                    success:function (loadedScene) {
                        callbacks.onSuccess(loadedScene);
                    },
                    error:function (error) {
                        callbacks.onError(error);
                    }
                });
            } catch (error) {
                callbacks.onError(error);
            }
        }
    };
});
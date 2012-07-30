/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 13:18
 */

define(["utils", "jquery"], function (utils, $) {
    "use strict";

    var _pathToSceneController = "http://localhost:9000/scenes";

    return {
        execute:function (sceneInformation, callback) {
            $.ajax({
                url:_pathToSceneController,
                type:"POST",
                dataType:"json",
                contentType:"application/json",
                data:JSON.stringify(sceneInformation),
                success:function (loadedScene) {
                    callback(null, loadedScene);
                },
                error:function (error) {
                    callback(error, null);
                }
            });
        }
    };
});
/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 13:18
 */

define(["utils", "amplify"], function (utils, amplify) {
    "use strict";

    var _pathToSceneController = "http://localhost:9000/scenes";

    amplify.request.define("getSceneByInformation", "ajax", {
        url:_pathToSceneController,
        type:"POST",
        dataType:"json",
        contentType:"application/json"
    });

    return {
        execute:function (sceneInformation) {
            amplify.request({
                resourceId:"getSceneByInformation",
                data:JSON.stringify(sceneInformation),
                success:function (loadedScene) {
                    amplify.publish("osiris-scene-ready", loadedScene);
                },
                error:function (error) {
                    amplify.publish("osiris-error", error);
                }
            });
        }
    };
});
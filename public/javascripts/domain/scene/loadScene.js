/**
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 16:21
 */

define(["utils"], function (utils) {
    "use strict";

    return {
        execute:function (sceneUrl) {
            var worker = new Worker("assets/javascripts/domain/scene/loadSceneById.js");
            utils.log(worker);

            worker.onerror = function (event) {
                utils.log("Worker error", event.data);
            };

            worker.onmessage = function (event) {
                utils.log("Worker responded " + event.data);
            };

            worker.postMessage("Hello");
        }
    };
});

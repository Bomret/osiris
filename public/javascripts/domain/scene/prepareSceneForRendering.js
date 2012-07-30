/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 16:38
 */

define(["utils", "async", "findNodes", "transformModelNode", "sendMessage", "messaging"], function (utils, async, findNodes, transformModelNode, sendMessage, msg) {
    "use strict";

    var _preparedScene,
        _callback;

    function _onComplete(error, results) {
        if (error) {
            _callback(error);
        } else {
            utils.log("PrepareSceneForRendering", results);
            _callback(null, _preparedScene);
        }
    }

    return {
        execute:function (loadedScene, glContext, callback) {
            _preparedScene = loadedScene;
            _callback = callback;

            async.auto({
                foundModelNodes:function (callback) {
                    utils.log("Exec findNodes");
                    findNodes.byType(loadedScene, "model", callback);
                },
                serverResponse:["foundModelNodes", function (callback, results) {
                    utils.log("Exec sendMessage");
                    sendMessage.execute(new msg.SetupRequest(results.foundModelNodes), callback);
                }],
                transformedNodes:["foundModelNodes", "serverResponse", function (callback, results) {
                    async.forEach(results.foundModelNodes, function (node) {
                        utils.log("Exec transformModelNode", node);
                        transformModelNode.execute(node, glContext, callback);
                    }, callback);
                }]
            }, _onComplete);
        }
    };
});
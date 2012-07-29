/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 16:38
 */

define(["utils", "async", "findNodes", "transformModelNode", "sendMessage", "messaging"], function (utils, async, findNodes, transformModelNode, sendMessage, msg) {
    "use strict";

    var _gl,
        _callback;

    function _onModelNodesSearchResult(error, foundNodes) {
        if (error) {
            _callback(error);
        }

        async.parallel([
            function (asyncCallback) {
                utils.log("Exec sendMessage");
                sendMessage.execute(new msg.SetupRequest(foundNodes), asyncCallback);
            },

            function (asyncCallback) {
                utils.log("Exec transformModelNode");
                async.forEach(foundNodes, function (node) {
                    utils.log("Model", node);
                    transformModelNode.execute(node, _gl, asyncCallback);
                });
            }
        ]);
    }

    return {
        execute:function (loadedScene, glContext, callback) {
            _gl = glContext;
            _callback = callback;

            findNodes.byType(loadedScene, "model", _onModelNodesSearchResult);
        }
    };
});
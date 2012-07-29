/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 16:38
 */

define(["utils", "async", "findNodes", "transformModelNode", "sendMessage", "messaging"], function (utils, async, findNodes, transformModelNode, sendMessage, msg) {
    "use strict";

    var _gl,
        _preparedScene,
        _callback;

    function _onModelNodesSearchResult(error, foundNodes) {
        if (error) {
            _handleError(error);
        }

        _notifyServerAndTransformNodes(foundNodes);
    }

    function _notifyServerAndTransformNodes(foundNodes) {
        async.parallel([
            function (callback) {
                sendMessage.execute(new msg.SetupRequest(foundNodes), callback);
            },

            function (callback) {
                async.forEach(foundNodes, function (node) {
                    transformModelNode.execute(node, _gl, callback);
                });
            }
        ], _onNodesTransformed);
    }

    function _onNodesTransformed(error) {
        if (error) {
            _handleError(error);
        }

        _callback(null, _preparedScene);
    }

    function _handleError(error) {
        _callback(error);
    }

    return {
        execute:function (loadedScene, glContext, callback) {
            _gl = glContext;
            _preparedScene = loadedScene;
            _callback = callback;

            findNodes.byType(loadedScene, "model", _onModelNodesSearchResult);
        }
    };
});
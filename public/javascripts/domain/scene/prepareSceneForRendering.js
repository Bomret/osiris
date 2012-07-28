/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 16:38
 */

define(["utils", "jquery", "findNodes", "transformModelNode", "sendMessage", "messaging"], function (utils, $, findNodes, transformModelNode, sendMessage, msg) {
    "use strict";

    var _ctx,
        _preparedScene,
        _successCallback,
        _errorCallback;

    function _onMessageFromServer(message) {
        utils.log("Got Message", message);
        _successCallback(_preparedScene);
    }

    function _onNodeSearchResult(foundNodes) {
        sendMessage.execute(new msg.OsirisMessage("setup", foundNodes), {
            onSuccess:_onMessageFromServer,
            onError:_errorCallback
        });

        $.each(foundNodes, function (index, node) {
            utils.log("Model", node);
            transformModelNode.execute(node, _ctx, {
                onSuccess:function (node) {
                    utils.log("Transformed node", node);
                },
                onError:_errorCallback
            });
        });
    }

    return {
        execute:function (loadedScene, context, callbacks) {
            _ctx = context;
            _preparedScene = loadedScene;
            _successCallback = callbacks.onSuccess;
            _errorCallback = callbacks.onError;

            try {
                findNodes.byType(loadedScene, "model", {
                    onSuccess:_onNodeSearchResult,
                    onError:_errorCallback
                });
            } catch (error) {
                _errorCallback(error);
            }
        }
    };
});
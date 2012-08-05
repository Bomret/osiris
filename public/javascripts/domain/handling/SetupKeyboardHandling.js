/**
 * Created with IntelliJ IDEA.
 * User: Stefan
 * Date: 05.08.12
 * Time: 12:38
 * To change this template use File | Settings | File Templates.
 */

define(["jquery", "FindNodes", "SendMessage", "GlMatrix", "Messaging"], function ($, FindNodes, SendMessage, GlMatrix, Msg) {
    "use strict";

    var _nodesToHandle = {},
        _transposedTransformation = GlMatrix.mat4.create(),
        _callback;

    function _onServerResponse(error, response) {
        var nodeToTransform,
            transformationToApply;

        if (error) {
            _callback(error);
        } else if (response.status === "transform") {
            nodeToTransform = _nodesToHandle[response.data.nodeId];
            transformationToApply = response.data.transformation;

            GlMatrix.mat4.transpose(transformationToApply, _transposedTransformation);
            nodeToTransform.transformation = _transposedTransformation;
        }
    }

    return {
        execute:function (loadedScene, keyMap, callback) {
            _callback = callback;

            FindNodes.byType(loadedScene, "model", function (error, nodes) {
                if (error) {
                    callback(error);
                } else {
                    $.each(nodes, function (index, node) {
                        _nodesToHandle[node.id] = node;
                    });
                }
            });

            $(document).keydown(function (event) {
                var manipulationRequest = keyMap[event.which];

                if (manipulationRequest) {
                    SendMessage.execute(new Msg.ManipulationRequest(manipulationRequest.nodeId, manipulationRequest.type, manipulationRequest.data), _onServerResponse);
                }
            });
        }
    };
});
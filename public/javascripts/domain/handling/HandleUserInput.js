/**
 * Created with IntelliJ IDEA.
 * User: Stefan
 * Date: 05.08.12
 * Time: 12:38
 * To change this template use File | Settings | File Templates.
 */

define(["jquery", "FindNodes", "SendMessage", "GlMatrix", "Messaging"], function($, FindNodes, SendMessage, GlMatrix, Msg) {
  "use strict";

  var _nodesToHandle = {},
    _callback;

  function _onServerResponse(error, response) {
    var nodeToTransform;

    if (error) {
      _callback(error);
    } else if (response.status === "transform") {
      nodeToTransform = _nodesToHandle[response.data.nodeId];
      nodeToTransform.transformation = response.data.transformation;
    }
  }

  return {
    execute: function(loadedScene, callback) {
      _callback = callback;

      FindNodes.byType(loadedScene, "model", function(error, nodes) {
        if (error) {
          callback(error);
        } else {
          $.each(nodes, function(index, node) {
            _nodesToHandle[node.id] = node;
          });
        }
      });

      FindNodes.byId(loadedScene, "keyboard", function(error, node) {
        if (error) {
          callback(error);
        } else {
          $(document).keydown(function(event) {
            var manipulationRequest = node.keyMap[event.which];

            if (manipulationRequest) {
              SendMessage.execute(new Msg.ManipulationRequest(manipulationRequest.nodeId, manipulationRequest.type, manipulationRequest.data), _onServerResponse);
            }
          });
        }
      });
    }
  };
});
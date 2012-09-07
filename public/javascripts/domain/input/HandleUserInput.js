/**
 * Handles the user's keyboard input.
 * If a pressed key is mapped to a specific manipulation type, a new ManipulationRequest is created using the referenced data and send to the server.
 *
 * This module also reacts to transformation messages send by the server by manipulating the node that is referenced in the request.
 *
 * User: Stefan
 * Date: 05.08.12
 * Time: 12:38
 */
define(["zepto", "FindNodes", "SendMessage", "Messaging"], function($, FindNodes, SendMessage, Msg) {
  "use strict";

  var _nodesToHandle = {},
    _callback;

  /**
   * Handles server messages. If the message is a request for transformation the transformation matrix of the referenced node will be replaced by the one provided in the message.
   *
   * If an error is encountered it is provided to the registered callback.
   *
   * @param {Error} error A possible error which will be provided to the registered callback.
   * @param {String} message A message from the server
   * @private
   */
  function _onServerMessage(error, message) {
    var nodeToTransform;

    if (error) {
      _callback(error);
    } else if (message.status === "transform") {
      nodeToTransform = _nodesToHandle[message.data.nodeId];
      nodeToTransform.transformation = message.data.transformation;
    }
  }

  return {

    /**
     * Starts the handling of user input for the given scene and communicates with the server about it. When the input triggers a scene manipulation it will be executed.
     *
     * @param {Object} loadedScene The scene for which the user input will be handled.
     * @param {Function} callback A registered callback that signals the result of the operation (error or success).
     */
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
              SendMessage.execute(new Msg.ManipulationRequest(manipulationRequest.nodeId, manipulationRequest.type, manipulationRequest.data), _onServerMessage);
            }
          });
        }
      });
    }
  };
});
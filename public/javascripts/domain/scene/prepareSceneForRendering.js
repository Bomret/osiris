/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 16:38
 */

define(["Utils", "async", "FindNodes", "TransformModelNode", "SendMessage", "Messaging"], function(Utils, Async, FindNodes, TransformModelNode, SendMessage, Messaging) {
  "use strict";

  var _preparedScene,
    _callback;

  function _onComplete(error, results) {
    if (error) {
      _callback(error);
    } else {
      Utils.log("PrepareSceneForRendering", results);
      _callback(null, _preparedScene);
    }
  }

  return {
    execute: function(loadedScene, glContext, callback) {
      _preparedScene = loadedScene;
      _callback = callback;

      Async.auto({
        foundModelNodes: function(callback) {
          Utils.log("Exec FindNodes");
          FindNodes.byType(loadedScene, "model", callback);
        },
        serverResponse: ["foundModelNodes", function(callback, results) {
          Utils.log("Exec SendMessage");
          SendMessage.execute(new Messaging.SetupRequest(results.foundModelNodes), callback);
        }],
        transformedNodes: ["foundModelNodes", "serverResponse", function(callback, results) {
          Async.forEach(results.foundModelNodes, function(node) {
            Utils.log("Exec TransformModelNode", node);
            TransformModelNode.execute(node, glContext, callback);
          }, callback);
        }]
      }, _onComplete);
    }
  };
});
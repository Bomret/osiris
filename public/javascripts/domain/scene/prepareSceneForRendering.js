/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 16:38
 */

define(["zepto", "async", "GlMatrix", "FindNodes", "TransformModelNode", "SendMessage", "Messaging"], function($, Async, GlMatrix, FindNodes, TransformModelNode, SendMessage, Messaging) {
  "use strict";

  var _preparedScene,
    _callback;

  function _onComplete(error) {
    if (error) {
      return _callback(error);
    }
    _callback(null, _preparedScene);
  }

  return {
    execute: function(loadedScene, glContext, callback) {
      _preparedScene = loadedScene;
      _callback = callback;

      Async.auto({
        foundModelNodes: function(callback) {
          FindNodes.byType(loadedScene, "model", callback);
        },
        serverResponse: ["foundModelNodes", function(callback, results) {
          SendMessage.execute(new Messaging.SetupRequest(results.foundModelNodes), callback);
        }],
        transformedNodes: ["foundModelNodes", "serverResponse", function(callback, results) {
          var nodes = [];
          Async.forEachSeries(results.foundModelNodes, function(node, callback) {
            TransformModelNode.execute(node, glContext, function(error, trans) {
              nodes.push(trans);
              callback(error);
            });
          }, function(error) {
            callback(error, nodes);
          });
        }]
      }, _onComplete);
    }
  };
});
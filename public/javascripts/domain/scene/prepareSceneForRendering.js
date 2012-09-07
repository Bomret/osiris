/**
 * Prepares the scene for rendering by transforming all necessary nodes to equivalent renderable representations.
 *
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 16:38
 */
define(["zepto", "async", "GlMatrix", "FindNodes", "TransformModelNode", "SendMessage", "Messaging"], function($, Async, GlMatrix, FindNodes, TransformModelNode, SendMessage, Messaging) {
  "use strict";

  var _preparedScene,
    _callback;

  /**
   * Executes the module's registered callback with either an occurred error or the results of the operation.
   *
   * @param {Error} error A possible error.
   * @private
   */
  function _onComplete(error) {
    if (error) {
      _callback(error);
      return;
    }
    _callback(null, _preparedScene);
  }

  return {

    /**
     * Starts the preparation of the given scene. The given callback is called in case an error happens or the preparation was successful. In the latter case the prepared scene is handed to the callback.
     *
     * @param {Object} scene The scene to be prepared
     * @param {WebGLRenderingContext} glContext The application's WebGL context.
     * @param {Function} callback A registered callback that signals the result of the operation (error or success).
     */
    execute: function(scene, glContext, callback) {
      _preparedScene = scene;
      _callback = callback;

      Async.auto({
        foundModelNodes: function(callback) {
          FindNodes.byType(scene, "model", callback);
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
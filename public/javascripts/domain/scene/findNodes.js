/**
 * Finds nodes of a specific type or id in a given traversable scene.
 *
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 14:36
 */

define(["TraverseScene"], function(TraverseScene) {
  "use strict";

  return {

    /**
     * Searches the given scene for nodes of the given type. The given callback is called in case an error happens or the search finishes. In the latter case an array containing the found nodes is handed to the callback. This array may be empty but never null.
     *
     * In a traversable scene every node has a "type" property. It has nodes of type "group" with "children" properties which are arrays and contain other nodes.
     *
     * @param {Object} traversableScene The scene to be searched
     * @param {String} nodeType The type of the nodes to be searched
     * @param {Function} callback A registered callback that signals the result of the operation (error or success).
     */
    byType: function(traversableScene, nodeType, callback) {
      var foundNodes = [];
      try {
        TraverseScene.execute(traversableScene, function(node) {
          if (node.type === nodeType) {
            foundNodes.push(node);
          }
        });

        callback(null, foundNodes);
      } catch (error) {
        callback(error);
      }
    },

    /**
     * Searches the given scene for a node with the given id. The given callback is called in case an error happens or the search finishes. In the latter case the found node is handed to the callback or null, if nothing was found.
     *
     * In a traversable scene every node has an "id" property. It has nodes of type "group" with "children" properties which are arrays and contain other nodes.
     *
     * @param {Object} traversableScene The scene to be searched
     * @param {String} nodeId The id of the node to be found
     * @param {Function} callback The callback that is executed either when an error is thrown or the search finishes.
     */
    byId: function(traversableScene, nodeId, callback) {
      var foundNode = null;
      try {
        TraverseScene.execute(traversableScene, function(node) {
          if (node.id === nodeId) {
            foundNode = node;
          }
        });

        callback(null, foundNode);
      } catch (error) {
        callback(error);
      }
    }
  };
});
/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 14:36
 *
 * This module contains methods to find nodes of a specific type or id in a given traversable scene.
 */

define(["TraverseScene"], function(TraverseScene) {
  "use strict";

  return {

    /**
     * This method searches the given scene for nodes of the given type. After the scene has been searched an array containing the found nodes is given to the callback. If an error occurs it will be given to the callback.
     *
     * In a traversable scene every node has a "type" property. It has nodes of type "group" with "children" properties which are arrays and contain other nodes.
     *
     * @param {Object} traversableScene The scene to be searched
     * @param {String} nodeType The type of the nodes to be searched
     * @param {Function} callback The callback that is executed either when an error is thrown or the search finishes.
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
     * This method searches the given scene for a node with the given id. After the scene has been searched the found node is given to the callback. If an error occurs it will be given to the callback.
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
/**
 * Traverses a scene and executes a callback function for each node of the scene.
 *
 * User: Stefan Reichel
 * Date: 08.07.12
 * Time: 15:11
 */
define(["zepto"], function($) {
  "use strict";

  /**
   * Executes the given executor function on the given node and all it's children.
   *
   * @param {Object} node The node to be traversed
   * @param {Function} executor The function to be executed.
   * @private
   */
  function _visit(node, executor) {
    executor(node);

    if (node.type === "group") {
      $.each(node.children, function(index, child) {
        _visit(child, executor);
      });
    }
  }

  return {

    /**
     * Starts the traversal of the given scene and executes the given executor function on every node of the scene, starting with the root node.
     * The executor function can check for the node properties "type" or "id" to determine if it should run or not.
     *
     * @param {Object} scene The scene to be traversed.
     * @param {Function} executor The function to be executed on every node in the scene.
     */
    execute: function(scene, executor) {
      var root = scene.rootNode;

      _visit(root, executor);
    }
  };
});
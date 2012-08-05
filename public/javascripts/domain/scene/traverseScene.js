/**
 * User: Stefan Reichel
 * Date: 08.07.12
 * Time: 15:11
 */

define(["Utils", "jquery"], function(Utils, $) {
  "use strict";

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
     *
     * @param {Object} traversableScene
     * @param {Function} executor
     */
    execute: function(traversableScene, executor) {
      var root = traversableScene.rootNode;

      _visit(root, executor);
    }
  };
});
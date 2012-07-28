/**
 * User: Stefan Reichel
 * Date: 08.07.12
 * Time: 15:11
 */

define(["utils", "jquery", "amplify"], function (utils, $, amplify) {
    "use strict";

    function _visit(node, executor) {
        executor(node);

        $.each(node.children, function (index, child) {
            _visit(child, executor);
        });
    }

    return {
        /**
         *
         * @param {Object} traversableScene
         * @param {Function} executor
         */
        execute:function (traversableScene, executor) {
            var root = traversableScene.rootNode;
            _visit(root, executor);
        }
    };
});
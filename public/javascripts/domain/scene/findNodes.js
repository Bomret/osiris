/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 14:36
 */

define(["Utils", "TraverseScene"], function (Utils, TraverseScene) {
    "use strict";

    return {
        byType:function (traversableScene, nodeType, callback) {
            var foundNodes = [];
            try {
                TraverseScene.execute(traversableScene, function (node) {
                    if (node.type === nodeType) {
                        foundNodes.push(node);
                    }
                });

                callback(null, foundNodes);
            } catch (error) {
                callback(error);
            }
        },

        byId:function (traversableScene, nodeId, callback) {
            var foundNode;
            try {
                TraverseScene.execute(traversableScene, function (node) {
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
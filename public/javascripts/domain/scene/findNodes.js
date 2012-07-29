/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 14:36
 */

define(["utils", "traverseScene"], function (utils, traverseScene) {
    "use strict";

    return {
        byType:function (traversableScene, nodeType, callback) {
            var foundNodes = [];
            try {
                traverseScene.execute(traversableScene, function (node) {
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
            try {
                traverseScene.execute(traversableScene, function (node) {
                    if (node.id === nodeId) {
                        callback(null, node);
                    }
                }, callback);
            } catch (error) {
                callback(error);
            }
        }
    };
});
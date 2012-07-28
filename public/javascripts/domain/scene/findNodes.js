/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 14:36
 */

define(["utils", "traverseScene"], function (utils, traverseScene) {
    "use strict";

    return {
        byType:function (traversableScene, nodeType, callbacks) {
            var foundNodes = [];
            try {
                traverseScene.execute(traversableScene, function (node) {
                    if (node.type === nodeType) {
                        foundNodes.push(node);
                    }
                });

                callbacks.onSuccess(foundNodes);
            } catch (error) {
                callbacks.onError(error);
            }
        },

        byId:function (traversableScene, nodeId, callbacks) {
            try {
                traverseScene.execute(traversableScene, function (node) {
                    if (node.id === nodeId) {
                        callbacks.onSuccess(node);
                    }
                });
            } catch (error) {
                callbacks.onError(error);
            }
        }
    };
});
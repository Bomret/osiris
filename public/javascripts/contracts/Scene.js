/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 20:40
 */

define(["utils"], function (utils) {
    "use strict";

    var makeBaseNode = function (id, type) {
        var _children = {};

        var _add = function (node) {
            if (!_children[node.id]) {
                _children[node.id] = node;
                utils.log("Added node", this, node);

                return true;
            } else {
                utils.log("Node already in here", this);

                return false;
            }
        };

        var _remove = function (node) {
            if (_children[node.id]) {
                delete _children[node.id];
                utils.log("Removed node", this, node);

                return true;
            } else {
                utils.log("Node is not in here", this);

                return false;
            }
        };

        var _visit = function (executor) {
            var child;

            if (typeof executor !== "function") {
                throw new TypeError("Parameter 'executor' must be a function.");
            }

            executor(this);

            for (var prop in _children) {
                if (_children.hasOwnProperty(prop)) {
                    child = _children[prop];
                    child.visit(executor);
                }
            }
        };

        var _findChildById = function (id) {
            var child;

            for (var prop in _children) {
                if (_children.hasOwnProperty(prop)) {
                    child = _children[prop];
                    utils.log("CHILD", child);
                    if (child.id === id) {
                        return child;
                    } else {
                        return child.findChildById(id);
                    }
                }
            }
        };

        var _findChildrenByType = function (type) {
            var child,
                children = [];

            for (var prop in _children) {
                if (_children.hasOwnProperty(prop)) {
                    child = children[prop];
                    if (child.type === type) {
                        children.push(child);
                    }
                }
            }

            return children;
        };

        return {
            id:id,
            type:type,
            addChild:_add,
            removeChild:_remove,
            findChildById:_findChildById,
            findChildrenByType:_findChildrenByType,
            visit:_visit
        };
    };

    return {
        /**
         *
         * @param {string} id
         * @param {RenderableModel} model
         */
        makeModelNode:function (id, model, transformation) {
            var that = makeBaseNode(id, "model");
            that.model = model;
            that.transformation = transformation;

            return Object.seal(that);
        },

        makeCameraNode:function (id, attributes) {
            var that = makeBaseNode(id, "camera");
            var _specs = attributes || {};
            that.position = _specs.position || {
                eye:[1, 1, 1],
                target:[0, 0, 0],
                up:[0, 1, 0]
            };
            that.optics = _specs.optics || {
                type:"perspective",
                focalDistance:60,
                aspectRatio:1.0,
                near:0.1,
                far:100
            };

            return Object.seal(that);
        },

        /**
         *
         * @param {string} id
         * @param {object} glInfo
         * @param {object} [clearColor]
         * @param {object} [options]
         */
        makeRendererNode:function (id, glInfo, clearColor, options) {
            var that = makeBaseNode(id, "renderer");
            that.glContext = glInfo.glContext;
            that.shaderProgram = glInfo.shaderProgram;
            that.clearColor = clearColor || {
                r:0.3,
                g:0.3,
                b:0.6,
                a:1.0
            };
            that.clear = glInfo.glContext.COLOR_BUFFER_BIT | glInfo.glContext.DEPTH_BUFFER_BIT;

            return Object.seal(that);
        },

        makeSceneDescription:function (sceneName, rendererNode) {
            if (rendererNode.type !== "renderer") {
                throw new TypeError("The given renderer node for the scene '" + sceneName + "' is not of type 'renderer'");
            }

            var _sceneRenderer = rendererNode;

            var _byNodeId = function (nodeId) {
                utils.log("Looking for id", nodeId);
                if (_sceneRenderer.id === nodeId) {
                    return _sceneRenderer;
                }
                return _sceneRenderer.findChildById(nodeId);
            };

            var _byType = function (nodeType) {
                if (_sceneRenderer.type === nodeType) {
                    return [_sceneRenderer];
                }
                return _sceneRenderer.findChildrenByType(nodeType);
            };

            var _traverse = function (processor, modelViewMatrix) {
                if (typeof processor !== "function") {
                    throw new TypeError("Parameter 'processor' must be a function.");
                }

                rendererNode.visit(processor, modelViewMatrix);
            };

            return Object.seal({
                name:sceneName,
                rootNode:_sceneRenderer,
                findNodeById:_byNodeId,
                findNodesByType:_byType,
                traverse:_traverse
            });
        }
    };
});
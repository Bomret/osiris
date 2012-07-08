/**
 * User: Stefan Reichel
 * Date: 21.06.12
 * Time: 02:58
 */

define(["rendering", "utils"], function(rendering, utils) {
    "use strict";

    var _renderableModel,
        _ctx;

    var transformVertices = function(element) {
        var buffer = _ctx.createBuffer();
        _ctx.bindBuffer(_ctx.ARRAY_BUFFER, buffer);
        _ctx.bufferData(_ctx.ARRAY_BUFFER, new Float32Array(element), _ctx.STATIC_DRAW);
        _ctx.bindBuffer(_ctx.ARRAY_BUFFER, null);

        return buffer;
    };

    return {
        execute: function(model, context) {
            var vertices = [],
                normals = [],
                texcoords = [],
                indices = [];

            _ctx = context;
            _renderableModel = rendering.makeRenderableModel();

            for (var i = 0; i < model.faces.length; i++) {

            }

            return _renderableModel;
        }
    };
});
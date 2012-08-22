/**
 * User: Stefan Reichel
 * Date: 21.06.12
 * Time: 02:58
 */

define(["async", "TransformMesh", "TransformMaterial"], function(Async, TransformMesh, TransformMaterial) {
  "use strict";

  var _callback,
    _transformedNode;

  function _onComplete(error, results) {
    if (error) {
      return _callback(error);
    }
    _transformedNode.mesh = results.transformedMesh;
    _transformedNode.material = results.transformedMaterial;

    _callback(null, _transformedNode);
  }

  return {
    execute: function(node, glContext, callback) {
      _callback = callback;
      _transformedNode = node;

      Async.parallel({
        transformedMesh: function(callback) {
          TransformMesh.execute(node.mesh, glContext, callback);
        },
        transformedMaterial: function(callback) {
          TransformMaterial.execute(node.material, glContext, callback);
        }
      }, _onComplete);
    }
  };
});
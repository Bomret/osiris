/**
 * User: Stefan Reichel
 * Date: 21.06.12
 * Time: 02:58
 */

define(["Utils", "async", "TransformMesh", "TransformMaterial"], function(Utils, Async, TransformMesh, TransformMaterial) {
  "use strict";

  var _callback;

  function _onComplete(error, results) {
    if (error) {
      _callback(error);
    } else {
      Utils.log("Transformed node", results);
      _callback(null, results);
    }
  }

  return {
    execute: function(node, glContext, callback) {
      _callback = callback;

      Async.parallel([
        function(callback) {
          TransformMesh.execute(node.mesh, glContext, callback);
        },
        function(callback) {
          TransformMaterial.execute(node.material, glContext, callback);
        }
      ], _onComplete);
    }
  };
});
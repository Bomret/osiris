/**
 * Transforms a model node into a renderable representation.
 * Transform means the referenced data types relevant for rendering will be converted into a WebGL friendly format.
 *
 * User: Stefan Reichel
 * Date: 21.06.12
 * Time: 02:58
 */
define(["async", "TransformMesh", "TransformMaterial"], function(Async, TransformMesh, TransformMaterial) {
  "use strict";

  var _callback,
    _transformedNode;

  /**
   * Executes the module's registered callback with either an occurred error or the results of the operation.
   *
   * @param {Error} error A possible error.
   * @param {Object} results The transformed model node.
   * @private
   */
  function _onComplete(error, results) {
    if (error) {
      _callback(error);
      return;
    }
    _transformedNode.mesh = results.transformedMesh;
    _transformedNode.material = results.transformedMaterial;

    _callback(null, _transformedNode);
  }

  return {

    /**
     * Starts the transformation of the given node into a renderable representation. The given callback is called in case an error happens or the transformation was successful. In the latter case the transformed model node is handed to the callback.
     *
     * @param {Object} node The model node to be transformed.
     * @param {WebGLRenderingContext} glContext The application's WebGL context.
     * @param {Function} callback A registered callback that signals the result of the operation (error or success).
     */
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
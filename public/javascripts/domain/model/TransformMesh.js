/**
 * Transforms a 3D mesh into a renderable representation.
 * Transform means the referenced data types relevant for rendering will be converted into a WebGL friendly format.
 *
 * User: Stefan Reichel
 * Date: 03.08.12
 * Time: 13:59
 */
define(["Error"], function(Error) {
  "use strict";

  var _gl;

  /**
   * Creates a new WebGLBuffer object and binds the given array to it as a Float32Array view.
   *
   * @param {Array} elements An array of elements to be bound as Float32Array view.
   * @return {WebGLBuffer} A reference to the created WebGLBuffer object filled with the data provided by the given elements array.
   * @private
   */
  function _transformArrayIntoFloat32ArrayBuffer(elements) {
    var buffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
    _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(elements), _gl.STATIC_DRAW);
    _gl.bindBuffer(_gl.ARRAY_BUFFER, null);

    return buffer;
  }

  /**
   * Creates a new WebGLBuffer object and binds the given array to it as a Uint16Array view.
   *
   * @param {Array} elements An array of elements to be bound as Uint16Array view.
   * @return {WebGLBuffer} A reference to the created WebGLBuffer object filled with the data provided by the given elements array.
   * @private
   */
  function _transformArrayIntoUint16ElementArrayBuffer(elements) {
    var buffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, buffer);
    _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), _gl.STATIC_DRAW);
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);

    return buffer;
  }

  return {

    /**
     * Starts the transformation of the given mesh into a renderable representation. The given callback is called in case an error happens or the transformation was successful. In the latter case the transformed mesh is handed to the callback.
     *
     * @param {Object} mesh The 3D mesh to be transformed.
     * @param {WebGLRenderingContext} glContext The application's WebGL context.
     * @param {Function} callback A registered callback that signals the result of the operation (error or success).
     */
    execute: function(mesh, glContext, callback) {
      _gl = glContext;

      if (_gl.isContextLost()) {
        callback(new Error.ContextLostError());
        return;
      }

      try {
        mesh.numVertices = mesh.vertices.length;
        mesh.vertices = _transformArrayIntoFloat32ArrayBuffer(mesh.vertices);

        mesh.numIndices = mesh.indices.length;
        mesh.indices = _transformArrayIntoUint16ElementArrayBuffer(mesh.indices);

        if (mesh.normals !== undefined) {
          mesh.numNormals = mesh.normals.length;
          mesh.normals = _transformArrayIntoFloat32ArrayBuffer(mesh.normals);
        }

        if (mesh.texCoords !== undefined) {
          mesh.numTexCoords = mesh.texCoords.length;
          mesh.texCoords = _transformArrayIntoFloat32ArrayBuffer(mesh.texCoords);
        }

        callback(null, mesh);
      } catch (error) {
        callback(error);
      }
    }
  };
});
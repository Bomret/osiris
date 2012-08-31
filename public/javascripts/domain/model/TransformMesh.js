/**
 * User: Stefan Reichel
 * Date: 03.08.12
 * Time: 13:59
 */

define(function() {
  "use strict";

  var _gl;

  function _transformArrayIntoFloat32ArrayBuffer(element) {
    var buffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
    _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(element), _gl.STATIC_DRAW);
    _gl.bindBuffer(_gl.ARRAY_BUFFER, null);

    return buffer;
  }

  function _transformArrayIntoUInt16ElementArrayBuffer(element) {
    var buffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, buffer);
    _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(element), _gl.STATIC_DRAW);
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);

    return buffer;
  }

  return {
    execute: function(meshData, glContext, callback) {
      var transformedMesh = {};
      _gl = glContext;

      if (_gl.isContextLost()) {
        callback({message: "WebGL context is lost in 'TransformMesh'."});
      }

      try {
        transformedMesh.numVertices = meshData.vertices.length;
        transformedMesh.vertices = _transformArrayIntoFloat32ArrayBuffer(meshData.vertices);

        transformedMesh.numIndices = meshData.indices.length;
        transformedMesh.indices = _transformArrayIntoUInt16ElementArrayBuffer(meshData.indices);

        if (meshData.normals !== undefined) {
          transformedMesh.numNormals = meshData.normals.length;
          transformedMesh.normals = _transformArrayIntoFloat32ArrayBuffer(meshData.normals);
        }

        if (meshData.texCoords !== undefined) {
          transformedMesh.numTexCoords = meshData.texCoords.length;
          transformedMesh.texCoords = _transformArrayIntoFloat32ArrayBuffer(meshData.texCoords);
        }

        callback(null, transformedMesh);
      } catch (error) {
        callback(error);
      }
    }
  };
});
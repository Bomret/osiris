/**
 * User: Stefan Reichel
 * Date: 03.08.12
 * Time: 13:59
 */

define(["Utils"], function(Utils) {
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
      _gl = glContext;

      try {
        meshData.numVertices = meshData.vertices.length;
        meshData.vertices = _transformArrayIntoFloat32ArrayBuffer(meshData.vertices);

        meshData.numNormals = meshData.normals.length;
        meshData.normals = _transformArrayIntoFloat32ArrayBuffer(meshData.normals);

        meshData.numTexCoords = meshData.texCoords.length;
        meshData.texCoords = _transformArrayIntoFloat32ArrayBuffer(meshData.texCoords);

        meshData.numIndices = meshData.indices.length;
        meshData.indices = _transformArrayIntoUInt16ElementArrayBuffer(meshData.indices);

        callback(null, meshData);
      } catch (error) {
        callback(error);
      }
    }
  };
});
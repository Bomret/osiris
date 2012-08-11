/**
 * User: Stefan Reichel
 * Date: 03.08.12
 * Time: 13:59
 */

define(["jquery"], function($) {
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
      var transformedMesh = $.extend(true, {}, meshData);
      _gl = glContext;

      try {
        transformedMesh.numVertices = transformedMesh.vertices.length;
        transformedMesh.vertices = _transformArrayIntoFloat32ArrayBuffer(transformedMesh.vertices);

        transformedMesh.numNormals = transformedMesh.normals.length;
        transformedMesh.normals = _transformArrayIntoFloat32ArrayBuffer(transformedMesh.normals);

        transformedMesh.numTexCoords = transformedMesh.texCoords.length;
        transformedMesh.texCoords = _transformArrayIntoFloat32ArrayBuffer(transformedMesh.texCoords);

        transformedMesh.numIndices = transformedMesh.indices.length;
        transformedMesh.indices = _transformArrayIntoUInt16ElementArrayBuffer(transformedMesh.indices);

        callback(null, transformedMesh);
      } catch (error) {
        callback(error);
      }
    }
  };
});
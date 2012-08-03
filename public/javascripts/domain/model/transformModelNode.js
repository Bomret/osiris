/**
 * User: Stefan Reichel
 * Date: 21.06.12
 * Time: 02:58
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

  function _transformMesh(mesh) {
    mesh.numVertices = mesh.vertices.length;
    mesh.vertices = _transformArrayIntoFloat32ArrayBuffer(mesh.vertices);

    mesh.numNormals = mesh.normals.length;
    mesh.normals = _transformArrayIntoFloat32ArrayBuffer(mesh.normals);

    mesh.numTexCoords = mesh.texCoords.length;
    mesh.texCoords = _transformArrayIntoFloat32ArrayBuffer(mesh.texCoords);

    mesh.numIndices = mesh.indices.length;
    mesh.indices = _transformArrayIntoUInt16ElementArrayBuffer(mesh.indices);
  }

  function _transformMaterial(material) {
    material.diffuseColor = _transformArrayIntoFloat32ArrayBuffer(material.diffuseColor);
  }

  return {
    execute: function(node, glContext, callback) {
      _gl = glContext;

      try {
        _transformMesh(node.mesh);
        //_transformMaterial(node.material);

        callback(null, node);
      } catch (error) {
        callback(error);
      }
    }
  };
});
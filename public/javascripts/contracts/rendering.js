/**
 * User: Stefan Reichel
 * Date: 28.06.12
 * Time: 16:32
 */

define(function() {
  "use strict";

  return {

    RenderableModel: function(meshDescription, material) {
      this.vertices = meshDescription.vertices;
      this.numVertices = meshDescription.numVertices;
      this.normals = meshDescription.normals;
      this.numNormals = meshDescription.numNormals;
      this.texCoords = meshDescription.texCoords;
      this.numTexCoords = meshDescription.numTexCoords;
      this.indices = meshDescription.indices;
      this.numIndices = meshDescription.numIndices;
      this.material = material;
    },

    Material: function(name, options) {
      this.name = name;
      this.ambientColor = options.ambientColor || [0.5, 0.5, 0.5]; // Grey
      this.diffuseColor = options.diffuseColor || [1.0, 0.0, 1.0]; // Fuchsia
      this.specularity = options.specularity || 1.0;
      this.diffuseMap = options.diffuseMap || undefined;
      this.normalMap = options.normalMap || undefined;
    },

    makePlane: function(dim, gl) {
      var verticesBuffer = gl.createBuffer(),
        normalsBuffer = gl.createBuffer(),
        texCoordsBuffer = gl.createBuffer(),
        indicesBuffer = gl.createBuffer(),
        d = dim / 2,
        vertices,
        indices,
        normals,
        texCoords;

      vertices = [
        -d, 0, d, //0
        d, 0, d, //1
        d, 0, -d, //2
        -d, 0, -d //3
      ];

      indices = [
        0, 1, 2, 2, 3, 0
      ];

      texCoords = [
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
      ];

      normals = [
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0
      ];

      gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

      return Object.seal({
        numIndices: indices.length,
        verts: verticesBuffer,
        numVerts: vertices.length,
        norms: normalsBuffer,
        tex: texCoordsBuffer,
        inds: indicesBuffer
      });
    }
  };
});
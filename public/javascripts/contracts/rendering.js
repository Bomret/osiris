/**
 * User: Stefan Reichel
 * Date: 28.06.12
 * Time: 16:32
 */

define(["glmatrix"], function(glmatrix) {
    "use strict";

    return {
        makeRenderableModel: function(modelDescription, glContext) {
            return {
                vertices: [],
                normals: [],
                texCoords: [],
                indices: [],
                numIndices: 0,
                numVertices: 0,
                numNormals: 0,
                numTexCoords: 0,
                material: null
            };
        },

        makeMaterial: function(name) {
            return Object.seal({
                name: name,
                ambientColor: null,
                diffuseColor: null,
                specularity: 0.0,
                diffuseMap: null,
                normalMap: null
            });
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
        },

        makeCube: function(dim, gl) {
            var verticesBuffer = gl.createBuffer();
            var normalsBuffer = gl.createBuffer();
            var texCoordsBuffer = gl.createBuffer();
            var indicesBuffer = gl.createBuffer();

            var d = dim / 2;

            var vertices = [
                // Front face
                -d, 0, d, // 0
                d, 0, d, // 1
                d, dim, d, // 2
                -d, dim, d, // 3

                // Left face
                d, 0, d, // 4
                d, 0, -d, // 5
                d, dim, -d, // 6
                d, dim, d, // 7

                // Back face
                d, 0, -d, // 8
                -d, 0, -d, // 9
                -d, dim, -d, // 10
                d, dim, -d, // 11

                // Right face
                -d, 0, -d, // 12
                -d, 0, d, // 13
                -d, dim, d, // 14
                -d, dim, -d, // 15

                // Bottom face
                -d, 0, -d, // 16
                d, 0, -d, // 17
                d, 0, d, // 18
                -d, 0, d, // 19

                // Top face
                -d, dim, d, // 20
                d, dim, d, // 21
                d, dim, -d, // 22
                -d, dim, -d // 23
            ];

            var indices = [
                0, 1, 2, 0, 2, 3, // Front face
                4, 5, 6, 4, 6, 7, // Left face
                8, 9, 10, 8, 10, 11, // Back face
                12, 13, 14, 12, 14, 15, // Right face
                16, 17, 18, 16, 18, 19, // Bottom face
                20, 21, 22, 20, 22, 23 // Top face
            ];

            var texCoords = [
                0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Front face
                0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Left face
                0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Back face
                0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Right face
                0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, // Bottom face
                0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0 // Top face
            ];

            var normals = [
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // Front face
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // Left face
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, // Back face
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // Right face
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // Bottom face
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0 // Top face
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
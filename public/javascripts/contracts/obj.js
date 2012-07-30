/**
 * User: Stefan Reichel
 * Date: 28.06.12
 * Time: 15:10
 */

define(function() {
  "use strict";

  return {
    makeModel: function() {
      return {
        vertices: [],
        normals: [],
        texCoords: [],
        groups: [],
        faces: [],
        materialLibrary: null
      };
    },

    makeFace: function() {
      return {
        vertices: [],
        normals: [],
        texCoords: [],
        material: null
      };
    },

    makeGroup: function(name) {
      return {
        name: name,
        faces: [],
        material: null
      };
    },

    makeMaterial: function(name) {
      return {
        name: name,
        ambientColor: [0.0, 0.0, 0.0]
      };
    }
  };
});
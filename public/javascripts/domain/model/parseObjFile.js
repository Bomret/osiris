/**
 * User: Stefan Reichel
 * Date: 21.06.12
 * Time: 03:09
 */

define(["Obj", "Utils", "ParseMtlFile"], function(Obj, Utils, ParseMtlFile) {
  "use strict";

  var _model,
    _geometry = {
      vertices: [],
      normals: [],
      texCoords: []
    };

  function processVertex(elements, type) {
    var value,
      vertex = [];

    for (var i = 1; i < elements.length; i++) {
      value = parseFloat(elements[i]);
      if (value) {
        vertex.push(value);
      }
    }

    _geometry[type].push(vertex);
  }

  function processFace(elements) {
    var face = Obj.makeFace(),
      faceElements,
      value;

    for (var i = 1; i < elements.length; i++) {
      faceElements = elements[i].split("/");

      value = parseInt(faceElements[0], 10);
      if (!isNaN(value)) {
        face.vertices.push(_geometry.vertices[value - 1]);
      }

      value = parseInt(faceElements[1], 10);
      if (!isNaN(value)) {
        face.texCoords.push(_geometry.texCoords[value - 1]);
      }

      value = parseInt(faceElements[2], 10);
      if (!isNaN(value)) {
        face.normals.push(_geometry.normals[value - 1]);
      }
    }

    _model.faces.push(face);
  }

  return {
    execute: function(modelFile) {
      var lines,
        line,
        elements;

      _model = Obj.makeModel();
      lines = modelFile.split("\n");

      for (var i = 0; i < lines.length; i++) {
        line = lines[i];
        elements = line.split(/ +/);

        if (Utils.stringStartsWith(line, "vn")) {
          processVertex(elements, "normals");
        } else if (Utils.stringStartsWith(line, "vt")) {
          processVertex(elements, "texCoords");
        } else if (Utils.stringStartsWith(line, "v")) {
          processVertex(elements, "vertices");
        } else if (Utils.stringStartsWith(line, "f")) {
          processFace(elements);
        }
      }

      _model.vertices = _geometry.vertices;
      _model.normals = _geometry.normals;
      _model.texCoords = _geometry.normals;

      return _model;
    }
  };
});
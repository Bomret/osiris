/**
 * User: Stefan Reichel
 * Date: 21.06.12
 * Time: 03:09
 */

define(["Obj", "Utils", "ParseMtlFile"], function(Obj, Utils, ParseMtlFile) {
  "use strict";

  var _model,
    _currentGroups,
    _currentMaterial,
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

    for (var j = 0; j < _currentGroups.length; j++) {
      _currentGroups[j].faces.push(face);
    }
  }

  function processGroups(elements) {
    var name,
      group;

    _currentGroups = [];

    if (elements.length === 1) {
      name = "default";
      group = Obj.makeGroup(name);
      _currentGroups.push(group);

      if (!Utils.containsObject(_model.groups, group)) {
        _model.groups.push(group);
      }
    } else {
      for (var i = 1; i < elements.length; i++) {
        name = elements[i];
        group = Obj.makeGroup(name);
        _currentGroups.push(group);

        if (!_model.groups[name]) {
          _model.groups.push(group);
        }
      }
    }
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
        } else if (Utils.stringStartsWith(line, "g")) {
          processGroups(elements);
        } else if (Utils.stringStartsWith(line, "mtllib")) {

        }
      }

      _model.vertices = _geometry.vertices;
      _model.normals = _geometry.normals;
      _model.texCoords = _geometry.normals;

      return _model;
    }
  };
});
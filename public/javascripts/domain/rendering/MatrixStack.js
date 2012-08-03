/**
 * User: Stefan Reichel
 * Date: 03.08.12
 * Time: 10:05
 */

define(["GlMatrix"], function(GlMatrix) {
  "use strict";

  var _stack = [];

  return {
    /**
     * Used to push a matrix onto the model view matrix stack.
     * Taken from Learning WebGL tutorials:
     * http://learningwebgl.com/
     */
    pushMatrix: function pushMatrix(matrix) {
      var copy = GlMatrix.mat4.create(matrix);
      _stack.push(copy);
    },

    /**
     * Used to pop the last added matrix from the model view matrix stack.
     * Taken from Learning WebGL tutorials:
     * http://learningwebgl.com/
     */
    popMatrix: function popMatrix() {
      if (_stack.length === 0) {
        throw "Invalid popMatrix!";
      }
      return _stack.pop();
    }
  };
});
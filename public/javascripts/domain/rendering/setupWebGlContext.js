/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 13:51
 */

define(["Utils", "WebGl"], function(Utils, WebGl) {
  "use strict";

  return {
    execute: function(canvas, callback) {
      var glContext;

      try {
        glContext = WebGl.setupWebGL(canvas);

        callback(null, glContext);
      } catch (error) {
        callback(error);
      }
    }
  };
});
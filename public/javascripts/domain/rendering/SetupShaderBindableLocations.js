/**
 * User: Stefan Reichel
 * Date: 03.08.12
 * Time: 15:25
 */

define(["zepto", "async"], function($, Async) {
  "use strict";

  return  {
    execute: function(glContext, shaderProgram, callback) {
      var locations = {},
        program = shaderProgram.program,
        bindables = shaderProgram.bindables;

      try {
        Async.parallel([
          function() {
            $.each(bindables.attributes, function(key, attribute) {
              var attributeLocation = glContext.getAttribLocation(program, attribute);
              glContext.enableVertexAttribArray(attributeLocation);
              locations[key] = attributeLocation;
            });
          },
          function() {
            $.each(bindables.uniforms, function(key, uniform) {
              locations[key] = glContext.getUniformLocation(program, uniform);
            });
          }
        ]);

        callback(null, locations);
      } catch (error) {
        callback(error);
      }
    }
  };
});
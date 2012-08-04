/**
 * User: Stefan Reichel
 * Date: 03.08.12
 * Time: 15:25
 */

define(function() {
  "use strict";

  return  {
    execute: function(glContext, shaderProgram, callback) {
      var locations = {},
        program = shaderProgram.program,
        bindables = shaderProgram.bindables,
        vertexPositionAttributeLocation,
        vertexColorAttributeLocation,
        modelViewMatrixUniformLocation,
        projectionMatrixUniformLocation;

      try {
        vertexPositionAttributeLocation = glContext.getAttribLocation(program, bindables.attributes.vertexPosition);
        glContext.enableVertexAttribArray(vertexPositionAttributeLocation);
        locations.vertexPositionAttributeLocation = vertexPositionAttributeLocation;

        vertexColorAttributeLocation = glContext.getAttribLocation(program, bindables.attributes.vertexColor);
        locations.vertexColorAttributeLocation = vertexColorAttributeLocation;

        modelViewMatrixUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.modelViewMatrix);
        locations.modelViewMatrixUniformLocation = modelViewMatrixUniformLocation;

        projectionMatrixUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.projectionMatrix);
        locations.projectionMatrixUniformLocation = projectionMatrixUniformLocation;

        callback(null, locations);
      } catch (error) {
        callback(error);
      }
    }
  };
});
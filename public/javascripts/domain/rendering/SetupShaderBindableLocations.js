/**
 * User: Stefan Reichel
 * Date: 03.08.12
 * Time: 15:25
 */

define(["Utils"],function(Utils) {
  "use strict";

  return  {
    execute: function(glContext, shaderProgram, callback) {
      var locations = {},
        program = shaderProgram.program,
        bindables = shaderProgram.bindables,
        vertexPositionAttributeLocation,
        vertexColorAttributeLocation,
        modelViewMatrixUniformLocation,
        projectionMatrixUniformLocation,
        normalMatrixUniformLocation,
        colorMapUniformLocation,
        normalMapUniformLocation,
        specularMapUniformLocation;

      Utils.log("BLA", shaderProgram);

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

        normalMatrixUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.normalMatrix);
        locations.normalMatrixUniformLocation = normalMatrixUniformLocation;

        colorMapUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.colorMap);
        locations.colorMapUniformLocation = colorMapUniformLocation;

        normalMapUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.normalMap);
        locations.normalMapUniformLocation = normalMapUniformLocation;

        specularMapUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.specularMap);
        locations.specularMapUniformLocation = specularMapUniformLocation;

        callback(null, locations);
      } catch (error) {
        callback(error);
      }
    }
  };
});
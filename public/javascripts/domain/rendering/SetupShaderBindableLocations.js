/**
 * User: Stefan Reichel
 * Date: 03.08.12
 * Time: 15:25
 */

define(["Utils"], function(Utils) {
  "use strict";

  return  {
    execute: function(glContext, shaderProgram, callback) {
      var locations = {},
        program = shaderProgram.program,
        bindables = shaderProgram.bindables,
        vertexPositionAttributeLocation,
        vertexTexCoordAttributeLocation,
        vertexNormalAttributeLocation,
        modelViewMatrixUniformLocation,
        projectionMatrixUniformLocation,
        normalMatrixUniformLocation,
        ambientLightColorUniformLocation,
        pointLightColorUniformLocation,
        pointLightPositionUniformLocation,
        pointLightSpecularColorUniformLocation,
        colorMapUniformLocation,
        normalMapUniformLocation,
        specularMapUniformLocation;

      try {
        vertexPositionAttributeLocation = glContext.getAttribLocation(program, bindables.attributes.vertexPosition);
        glContext.enableVertexAttribArray(vertexPositionAttributeLocation);
        locations.vertexPositionAttributeLocation = vertexPositionAttributeLocation;

        vertexNormalAttributeLocation = glContext.getAttribLocation(program, bindables.attributes.vertexNormal);
        glContext.enableVertexAttribArray(vertexNormalAttributeLocation);
        locations.vertexNormalAttributeLocation = vertexNormalAttributeLocation;

        vertexTexCoordAttributeLocation = glContext.getAttribLocation(program, bindables.attributes.vertexTexCoords);
        glContext.enableVertexAttribArray(vertexTexCoordAttributeLocation);
        locations.vertexTexCoordAttributeLocation = vertexTexCoordAttributeLocation;

        modelViewMatrixUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.modelViewMatrix);
        locations.modelViewMatrixUniformLocation = modelViewMatrixUniformLocation;

        projectionMatrixUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.projectionMatrix);
        locations.projectionMatrixUniformLocation = projectionMatrixUniformLocation;

        normalMatrixUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.normalMatrix);
        locations.normalMatrixUniformLocation = normalMatrixUniformLocation;

        ambientLightColorUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.ambientLightColor);
        locations.ambientLightColorUniformLocation = ambientLightColorUniformLocation;

        pointLightColorUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.pointLightColor);
        locations.pointLightColorUniformLocation = pointLightColorUniformLocation;

        pointLightPositionUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.pointLightPosition);
        locations.pointLightPositionUniformLocation = pointLightPositionUniformLocation;

        pointLightSpecularColorUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.pointLightSpecularColor);
        locations.pointLightSpecularColorUniformLocation = pointLightSpecularColorUniformLocation;

        colorMapUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.colorMap);
        locations.colorMapUniformLocation = colorMapUniformLocation;

        normalMapUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.normalMap);
        locations.normalMapUniformLocation = normalMapUniformLocation;

        specularMapUniformLocation = glContext.getUniformLocation(program, bindables.uniforms.specularMap);
        locations.specularMapUniformLocation = specularMapUniformLocation;

        Utils.log("Locations", locations);

        callback(null, locations);
      } catch (error) {
        callback(error);
      }
    }
  };
});
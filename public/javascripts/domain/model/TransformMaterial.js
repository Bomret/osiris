/**
 * User: Stefan Reichel
 * Date: 09.08.12
 * Time: 23:45
 */

define(function() {
  "use strict";

  var _gl,
    _callback;

  /**
   * This function is used to create a 2D WebGl conformant texture
   * from a valid jpg, png or gif image specified by the given path.
   * Uses the JavaScript Image object to load the file.
   */
  function _createTexture(pathToImage) {
    var texture = _gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function() {
      _handleLoadedTexture(texture);
    };
    texture.image.onerror = function(error) {
      _callback(error);
    };
    texture.image.name = pathToImage;
    texture.image.src = pathToImage;

    return texture;
  }

  /**
   * Creates a valid WebGl conformant texture object from the given texture.
   */
  function _handleLoadedTexture(texture) {
    _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, true);
    _gl.bindTexture(_gl.TEXTURE_2D, texture);
    _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, texture.image);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.LINEAR);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR_MIPMAP_NEAREST);
    _gl.generateMipmap(_gl.TEXTURE_2D);

    _gl.bindTexture(_gl.TEXTURE_2D, null);
  }

  return {
    execute: function(materialData, glContext, callback) {
      _gl = glContext;
      _callback = callback;

      try {
        var colorMapPath = "assets/materials/" + materialData.colorMap;
        materialData.colorMap = _createTexture(colorMapPath);

        var normalMapPath = "assets/materials/" + materialData.normalMap;
        materialData.normalMap = _createTexture(normalMapPath);

        var specularMapPath = "assets/materials/" + materialData.specularMap;
        materialData.specularMap = _createTexture(specularMapPath);

        callback(null, materialData);
      } catch (error) {
        callback(error);
      }
    }
  };
});
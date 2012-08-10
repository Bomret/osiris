/**
 * User: Stefan Reichel
 * Date: 09.08.12
 * Time: 23:45
 */

define(["Utils", "async", "jquery"], function(Utils, Async, $) {
  "use strict";

  var _gl,
    _callback,
    _transformedMaterial;

  /**
   * This function is used to create a 2D WebGl conforming texture
   * from a valid jpg, png or gif image specified by the given path.
   * Uses the JavaScript Image object to load the file.
   */
  function _createTexture(pathToImage, callback) {
    var image = new Image();

    image.onload = function() {
      _handleLoadedImage(image, callback);
    };

    image.onerror = function(error) {
      callback(error);
    };

    image.src = pathToImage;
  }

  /**
   * Creates a valid WebGl conforming texture object from the given image and texture.
   */
  function _handleLoadedImage(image, callback) {
    var texture = _gl.createTexture();

    _gl.bindTexture(_gl.TEXTURE_2D, texture);
    _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, true);
    _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, image);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR_MIPMAP_NEAREST);
    _gl.generateMipmap(_gl.TEXTURE_2D);

    _gl.bindTexture(_gl.TEXTURE_2D, null);

    callback(null, texture);
  }

  function _onComplete(error, results) {
    if (error) {
      _callback(error);
    } else {
      Utils.log("RESULTS", results);
      _transformedMaterial.colorMap = results.colorMap;
      _transformedMaterial.normalMap = results.normalMap;
      _transformedMaterial.specularMap = results.specularMap;

      _callback(null, _transformedMaterial);
    }
  }

  return {
    execute: function(materialData, glContext, callback) {
      _gl = glContext;
      _callback = callback;
      _transformedMaterial = $.extend(true, {}, materialData);

      try {
        Async.parallel({
          colorMap: function(callback) {
            var colorMapPath = "assets/materials/" + materialData.colorMap;
            _createTexture(colorMapPath, callback);
          },
          normalMap: function(callback) {
            var normalMapPath = "assets/materials/" + materialData.normalMap;
            _createTexture(normalMapPath, callback);
          },
          specularMap: function(callback) {
            var specularMapPath = "assets/materials/" + materialData.specularMap;
            _createTexture(specularMapPath, callback);
          }
        }, _onComplete);
      } catch (error) {
        callback(error);
      }
    }
  };
});
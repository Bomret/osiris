/**
 * Transforms a material into a renderable representation.
 * Transform means the referenced data types relevant for rendering will be converted into a WebGL friendly format.
 *
 * User: Stefan Reichel
 * Date: 09.08.12
 * Time: 23:45
 */
define(["async", "zepto"], function(Async, $) {
  "use strict";

  var _gl,
    _callback,
    _transformedMaterial;

  /**
   * Creates a 2D WebGl conforming texture from a valid jpg, png or gif image specified by the given url.
   * As soon as the texture creation is complete or an error occurs the registered callback is executed.
   *
   * @param {String} urlToImage The URL to the image.
   * @param {Function} callback A registered callback that signals the result of the operation (error or success).
   * @private
   */
  function _createTexture(urlToImage, callback) {
    var image = new Image();

    image.onload = function() {
      _handleLoadedImage(image, callback);
    };

    image.onerror = function(error) {
      callback(error);
    };

    image.src = urlToImage;
  }

  /**
   * Handles a downloaded image and transforms it into a WebGL conforming texture.
   * When the texture was created successfully the registered callback is executed with the reference to the texture as parameter. Otherwise the occurred error is handed to the callback.
   *
   * @param {Image} image A JavaScript image object
   * @param {Function} callback A registered callback that signals the result of the operation (error or success).
   * @private
   */
  function _handleLoadedImage(image, callback) {
    var texture;

    if (_gl.isContextLost()) {
      callback(new Error.ContextLostError());
      return;
    }

    texture = _gl.createTexture();
    _gl.bindTexture(_gl.TEXTURE_2D, texture);
    _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, true);
    _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, image);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.LINEAR);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR_MIPMAP_LINEAR);
    _gl.generateMipmap(_gl.TEXTURE_2D);

    _gl.bindTexture(_gl.TEXTURE_2D, null);

    callback(null, texture);
  }

  /**
   * Executes the module's registered callback with either an occurred error or the results of the operation.
   *
   * @param {Error} error A possible error.
   * @param {Object} results The transformed material.
   * @private
   */
  function _onComplete(error, results) {
    if (error) {
      _callback(error);
      return;
    }
    _transformedMaterial.colorMap = results.colorMap;
    _transformedMaterial.specularMap = results.specularMap;

    _callback(null, _transformedMaterial);
  }

  return {

    /**
     * Starts the transformation of the given material into a renderable representation. The given callback is called in case an error happens or the transformation was successful. In the latter case the transformed material is handed to the callback.
     *
     * @param {Object} material The material to be transformed.
     * @param {WebGLRenderingContext} glContext The application's WebGL context.
     * @param {Function} callback A registered callback that signals the result of the operation (error or success).
     */
    execute: function(material, glContext, callback) {
      _gl = glContext;
      _callback = callback;
      _transformedMaterial = material;

      Async.parallel({
        colorMap: function(callback) {
          if (material.colorMap !== undefined) {
            var colorMapPath = "assets/materials/" + material.colorMap;
            _createTexture(colorMapPath, callback);
          } else {
            callback(null, undefined);
          }
        },
        specularMap: function(callback) {
          if (material.specularMap !== undefined) {
            var specularMapPath = "assets/materials/" + material.specularMap;
            _createTexture(specularMapPath, callback);
          } else {
            callback(null, undefined);
          }
        }
      }, _onComplete);
    }
  };
});
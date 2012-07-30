/**
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 20:40
 */

define(["utils"], function(utils) {
  "use strict";

  return {

    /**
     * This object contains the necessary information to get a load a scene specified by the given name and file from the application server.
     *
     * @constructor
     * @param {String} name The name of the shader
     * @param {String} file The file containing the scene information
     */
    SceneInformation: function(name, file) {
      this.name = name;
      this.file = file;
    }
  }
});
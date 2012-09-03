/**
 * Contains data objects relevant for scene handling.
 *
 * User: Stefan Reichel
 * Date: 18.06.12
 * Time: 20:40
 */
define(function() {
  "use strict";

  return {

    /**
     * Contains the necessary information to load a scene specified by the given name and file from the application server.
     *
     * @constructor
     * @param {String} name The name of the scene
     * @param {String} file The file containing the Scene information
     */
    SceneInformation: function(name, file) {
      this.name = name;
      this.file = file;
    }
  };
});
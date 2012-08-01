/**
 * User: Stefan Reichel
 * Date: 31.07.12
 * Time: 23:21
 */

define(["jquery"], function($) {
  "use strict";

  return {
    execute: function(colladaFileName, callback) {
      $.get("http://localhost:9000/assets/models/barrel/barrel.dae", function(data) {
        callback(data);
      });
    }
  };
});
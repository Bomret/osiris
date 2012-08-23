/**
 * User: Stefan Reichel
 * Date: 19.06.12
 * Time: 10:09
 */

define(function() {
  "use strict";

  return {
    info: function() {
      var message = Array.prototype.slice.call(arguments);

      if (window.console && window.console.log) {
        window.console.log(message);
      } else {
        window.alert(message);
      }
    },

    error: function() {
      if (window.console && window.console.error) {
        window.console.error(Array.prototype.slice.call(arguments));
      } else {
        this.info(arguments);
      }
    }
  };
});

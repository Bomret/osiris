define(function() {
  "use strict";

  return {
    info: function() {
      if (window.console) {
        console.log(Array.prototype.slice.call(arguments));
      }
    },
    error: function() {
      if (window.console && window.console.error) {
        console.error(Array.prototype.slice.call(arguments));
      } else {
        this.info(arguments);
      }
    }
  };
});

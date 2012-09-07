/**
 * Contains custom error objects.
 *
 * User: Stefan Reichel
 * Date: 03.09.12
 * Time: 00:27
 */

define(function() {
  "use strict";

  return {

    /**
     * Used when the application loses it's WebGL context.
     *
     * @constructor
     */
    ContextLostError: function() {
      this.message = "WebGL context lost.";
    }
  };
});
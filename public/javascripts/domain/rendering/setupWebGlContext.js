/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 13:51
 */

define(["utils", "webgl", "amplify"], function (utils, webgl, amplify) {
    "use strict";

    return {
        execute:function (canvas) {
            var context;

            utils.log("Canvas", canvas);

            canvas.width = Math.floor(window.innerWidth * 0.9);
            canvas.height = Math.floor(window.innerHeight * 0.9);

            try {
                context = webgl.setupWebGL(canvas);
                amplify.publish("osiris-context-ready", context);
            } catch (error) {
                amplify.publish("osiris-error", error);
            }
        }
    };
});
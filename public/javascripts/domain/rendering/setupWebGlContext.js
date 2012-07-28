/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 13:51
 */

define(["utils", "webgl"], function (utils, webgl) {
    "use strict";

    return {
        execute:function (canvas, callbacks) {
            var glContext;

            utils.log("Canvas", canvas);

            try {
                glContext = webgl.setupWebGL(canvas);
                callbacks.onSuccess(glContext);
            } catch (error) {
                callbacks.onError(error);
            }
        }
    };
});
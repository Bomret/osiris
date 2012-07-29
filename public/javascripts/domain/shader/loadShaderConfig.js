/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 12:23
 */

define(["utils", "jquery"], function (utils, $) {
    "use strict";

    var _pathToShaderController = "http://localhost:9000/shaders";

    return {
        execute:function (shaderInformation, glContext, callback) {
            try {
                $.ajax({
                    url:_pathToShaderController,
                    type:"POST",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(shaderInformation),
                    success:function (shaderConfig) {
                        callback(null, shaderConfig, glContext);
                    },
                    error:function (error) {
                        callback(error, null);
                    }
                });
            } catch (error) {
                callbacks.onError(error);
            }
        }
    };
});
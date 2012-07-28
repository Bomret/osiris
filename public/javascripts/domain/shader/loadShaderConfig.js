/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 12:23
 */

define(["utils", "amplify", "jquery"], function (utils, amplify, $) {
    "use strict";

    var _pathToShaderController = "http://localhost:9000/shaders";

    return {
        execute:function (shaderInformation, callbacks) {
            try {
                $.ajax({
                    url:_pathToShaderController,
                    type:"POST",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(shaderInformation),
                    success:callbacks.onSuccess,
                    error:callbacks.onError
                });
            } catch (error) {
                callbacks.onError(error);
            }
        }
    };
});
/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 12:23
 */

define(["utils", "amplify", "jquery"], function (utils, amplify, $) {
    "use strict";

    var _pathToShaderController = "http://localhost:9000/shaders";

    return {
        execute:function (shaderInformation) {
            $.ajax({
                url:_pathToShaderController,
                type:"POST",
                contentType:"application/json",
                data:JSON.stringify(shaderInformation),
                success:function (data) {
                    amplify.publish("osiris-shader-load", data);
                },
                error:function (status) {
                    amplify.publish("osiris-shader-error", status);
                }
            });
        }
    };
});
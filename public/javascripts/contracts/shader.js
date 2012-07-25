/**
 * User: Stefan Reichel
 * Date: 30.06.12
 * Time: 17:59
 */

define(function () {
    "use strict";

    return {
        makeShaderProgram:function (config) {
            return {
                name:config.name,
                program:null,
                vertexShader:null,
                fragmentShader:null,
                bindables:config.bindables
            };
        },

        ShaderInformation:function (name, file) {
            this.name = name;
            this.file = file;
        },

        makeShader:function (type) {
            return {
                type:type,
                shader:null
            };
        }
    };
});
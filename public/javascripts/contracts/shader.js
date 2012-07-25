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

        /**
         *
         * @constructor
         * @param {String} name
         * @param {String} file
         */
        ShaderInformation:function (name, file) {
            this.name = name;
            this.file = file;
        },

        /**
         *
         * @constructor
         * @param {Object} obj
         */
        ShaderConfig:function (obj) {
            var json;
        },


        /**
         *
         * @param {String} type
         * @param shader
         * @constructor
         */
        Shader:function (type, shader) {
            this.type = type;
            this.shader = shader;
        }
    };
})
;
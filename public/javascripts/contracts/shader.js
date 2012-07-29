/**
 * User: Stefan Reichel
 * Date: 30.06.12
 * Time: 17:59
 */

define(function () {
    "use strict";

    return {
        /**
         *
         * @param {String} name
         * @param {WebGLProgram} program
         * @param {WebGLShader} vertexShader
         * @param {WebGLShader} fragmentShader
         * @param {Object} bindables
         * @constructor
         */
        ShaderProgram:function (name, program, vertexShader, fragmentShader, bindables) {
            this.name = name;
            this.program = program;
            this.vertexShader = vertexShader;
            this.fragmentShader = fragmentShader;
            this.bindables = bindables;
        },

        /**
         *
         * @constructor
         * @param {String} name
         * @param {String} file
         */
        ShaderConfigurationInformation:function (name, file) {
            this.name = name;
            this.config = file;
        }
    };
})
;
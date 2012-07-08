/**
 * User: Stefan Reichel
 * Date: 30.06.12
 * Time: 17:59
 */

define(function() {
    "use strict";

    return {

        /**
         *
         * @param {Object} config
         * @return {ShaderProgram}
         */
        makeShaderProgram: function(config) {
            return {
                name: config.name,
                program: null,
                vertexShader: null,
                fragmentShader: null,
                bindables: config.bindables
            };
        },

        makeShader: function(type) {
            return {
                type: type,
                shader: null
            };
        }
    };
});
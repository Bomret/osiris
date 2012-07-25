/**
 * User: Stefan Reichel
 * Date: 28.06.12
 * Time: 14:11
 */

require.config({
    // legacy non AMD scripts that add themselves to the global object

    paths:{
        // libraries
        jquery: "lib/jquery",
        glmatrix:"lib/glmatrix",
        webgl:"lib/webgl-utils",
        utils:"lib/utils",

        // views
        mainViewModel:"views/mainViewModel",

        // infrastructure
        ServerRequest:"infrastructure/ServerRequest",

        // domain
        loadShaders:"domain/shader/loadShaders",
        buildShaderProgram:"domain/shader/buildShaderProgram",
        loadObjModel:"domain/model/loadObjModel",
        parseObjFile:"domain/model/parseObjFile",
        parseMtlFile:"domain/model/parseMtlFile",
        transformObjModel:"domain/model/transformObjModel",
        loadScene:"domain/scene/loadScene",
        renderScene:"domain/scene/renderScene",

        // contracts
        obj:"contracts/obj",
        shader:"contracts/shader",
        rendering:"contracts/rendering",
        scene:"contracts/scene"
    }
})
;

require(['osiris'], function (Osiris) {
    "use strict";

    Osiris.init({
        canvasId:"renderCanvas",
        canvasWidth:600,
        canvasHeight:600,
        clearColor:{
            r:0.3,
            g:0.3,
            b:0.6,
            a:1.0
        }
    });
});
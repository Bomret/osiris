/**
 * User: Stefan Reichel
 * Date: 28.06.12
 * Time: 14:11
 */

require.config({
    // legacy non AMD scripts that add themselves to the global object
    shim:{
        "amplify":{
            deps:["jquery"],
            exports:"amplify"
        }
    },

    paths:{
        // libraries
        jquery:"lib/jquery",
        amplify:"lib/amplify.min",
        glmatrix:"lib/glmatrix",
        webgl:"lib/webgl-utils",
        utils:"lib/utils",

        // infrastructure
        sendMessage:"infrastructure/sendMessageToServer",

        // views
        mainViewModel:"views/mainViewModel",

        // domain
        setupWebGlContext:"domain/rendering/setupWebGlContext",
        loadShaders:"domain/shader/loadShaders",
        loadShaderConfig:"domain/shader/loadShaderConfig",
        buildShaderProgram:"domain/shader/buildShaderProgram",
        loadObjModel:"domain/model/loadObjModel",
        parseObjFile:"domain/model/parseObjFile",
        parseMtlFile:"domain/model/parseMtlFile",
        transformObjModel:"domain/model/transformObjModel",
        loadScene:"domain/scene/loadScene",
        loadSceneFromServer:"domain/scene/loadSceneFromServer",
        renderScene:"domain/scene/renderScene",

        // contracts
        obj:"contracts/obj",
        shader:"contracts/shader",
        rendering:"contracts/rendering",
        scene:"contracts/scene"
    }
});

require(['osiris'], function (Osiris) {
    "use strict";

    Osiris.execute();
});
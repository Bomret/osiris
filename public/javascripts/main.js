/**
 * User: Stefan Reichel
 * Date: 28.06.12
 * Time: 14:11
 */

require.config({
    // legacy non AMD scripts that add themselves to the global object
    shim:{
        "async":{
            exports:"async"
        }
    },

    paths:{
        // app
        Osiris:"Osiris",

        // libraries
        jquery:"lib/jquery",
        async:"lib/async",
        GlMatrix:"lib/glmatrix",
        WebGl:"lib/webgl-utils",
        Utils:"lib/Utils",

        // infrastructure
        SendMessage:"infrastructure/SendMessageToServer",

        // view
        MainViewModel:"view/MainViewModel",

        // domain
        // -- handling
        SetupKeyboardHandling:"domain/handling/SetupKeyboardHandling",

        // -- rendering
        SetupWebGlContext:"domain/rendering/SetupWebGlContext",
        SetupShaderBindableLocations:"domain/rendering/SetupShaderBindableLocations",

        // -- shader
        LoadShaders:"domain/shader/LoadShaders",
        LoadShaderConfig:"domain/shader/LoadShaderConfig",
        BuildShaderProgram:"domain/shader/BuildShaderProgram",

        // -- model
        TransformModelNode:"domain/model/TransformModelNode",
        ParseObjFile:"domain/model/ParseObjFile",

        // -- Scene
        LoadScene:"domain/scene/LoadScene",
        DownloadSceneFromServer:"domain/scene/DownloadSceneFromServer",
        PrepareSceneForRendering:"domain/scene/PrepareSceneForRendering",
        TraverseScene:"domain/scene/TraverseScene",
        TraverseAndRender:"domain/scene/TraverseAndRender",
        FindNodes:"domain/scene/FindNodes",
        RenderScene:"domain/scene/RenderScene",

        // contracts
        Messaging:"contracts/Messaging",
        Obj:"contracts/Obj",
        Shader:"contracts/Shader",
        Rendering:"contracts/Rendering",
        Scene:"contracts/Scene"
    }
});

require(["Osiris"], function (Osiris) {
    "use strict";

    try {
        Osiris.execute();
    } catch (error) {
        window.alert(error.message);
    }
});
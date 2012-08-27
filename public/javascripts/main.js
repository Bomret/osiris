/**
 * User: Stefan Reichel
 * Date: 28.06.12
 * Time: 14:11
 */

require.config({
  // Non AMD scripts that add themselves to the global object
  shim: {
    "async": {
      exports: "async"
    },
    "zepto": {
      exports: "$"
    }
  },

  paths: {
    // app
    Osiris: "Osiris",

    // libraries
    zepto: "lib/zepto",
    async: "lib/async",
    GlMatrix: "lib/glmatrix",
    WebGl: "lib/webgl-utils",
    Log: "lib/log",

    // infrastructure
    SendMessage: "infrastructure/SendMessageToServer",

    // view
    MainViewModel: "view/MainViewModel",

    // domain
    // -- handling
    HandleUserInput: "domain/input/HandleUserInput",

    // -- rendering
    SetupWebGlContext: "domain/rendering/SetupWebGlContext",
    SetupShaderBindableLocations: "domain/rendering/SetupShaderBindableLocations",

    // -- shader
    LoadShaders: "domain/shader/LoadShaders",
    DownloadShaderConfigFromServer: "domain/shader/DownloadShaderConfigFromServer",
    BuildShaderProgram: "domain/shader/BuildShaderProgram",

    // -- model
    TransformModelNode: "domain/model/TransformModelNode",
    TransformMesh: "domain/model/TransformMesh",
    TransformMaterial: "domain/model/TransformMaterial",
    ParseObjFile: "domain/model/ParseObjFile",

    // -- Scene
    LoadScene: "domain/scene/LoadScene",
    DownloadSceneFromServer: "domain/scene/DownloadSceneFromServer",
    PrepareSceneForRendering: "domain/scene/PrepareSceneForRendering",
    TraverseScene: "domain/scene/TraverseScene",
    TraverseAndRender: "domain/scene/TraverseAndRender",
    FindNodes: "domain/scene/FindNodes",
    RenderScene: "domain/scene/RenderScene",

    // contracts
    Messaging: "contracts/Messaging",
    Obj: "contracts/Obj",
    Shader: "contracts/Shader",
    Scene: "contracts/Scene"
  }
});

require(["Osiris", "Log"], function(Osiris, Log) {
  "use strict";

  try {
    Osiris.init();
  } catch (error) {
    window.alert("An unexpected error happended. Please see the console log for details.");
    Log.error(error.message, error.stack);
  }
});
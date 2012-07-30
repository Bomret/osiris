/**
 * User: Stefan Reichel
 * Date: 28.06.12
 * Time: 14:11
 */

require.config({
  // legacy non AMD scripts that add themselves to the global object
  shim: {
    "async": {
      exports: "async"
    }
  },

  paths: {
    // app
    osiris: "osiris",

    // libraries
    jquery: "lib/jquery",
    async: "lib/async",
    glmatrix: "lib/glmatrix",
    webgl: "lib/webgl-utils",
    utils: "lib/utils",

    // infrastructure
    sendMessage: "infrastructure/sendMessageToServer",

    // view
    mainViewModel: "view/mainViewModel",

    // domain
    // -- rendering
    setupWebGlContext: "domain/rendering/setupWebGlContext",

    // -- shader
    loadShaders: "domain/shader/loadShaders",
    loadShaderConfig: "domain/shader/loadShaderConfig",
    buildShaderProgram: "domain/shader/buildShaderProgram",

    // -- model
    transformModelNode: "domain/model/transformModelNode",

    // -- scene
    loadScene: "domain/scene/loadScene",
    downloadSceneFromServer: "domain/scene/downloadSceneFromServer",
    prepareSceneForRendering: "domain/scene/prepareSceneForRendering",
    traverseScene: "domain/scene/traverseScene",
    findNodes: "domain/scene/findNodes",
    renderScene: "domain/scene/renderScene",

    // contracts
    messaging: "contracts/messaging",
    obj: "contracts/obj",
    shader: "contracts/shader",
    rendering: "contracts/rendering",
    scene: "contracts/scene"
  }
});

require(["osiris"], function(Osiris) {
  "use strict";

  Osiris.execute();
});
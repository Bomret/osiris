/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["Utils", "jquery", "async", "MainViewModel", "SetupWebGlContext", "LoadShaders", "LoadScene", "SendMessage", "FindNodes", "RenderScene", "Messaging", "GlMatrix"],
  function(Utils, $, Async, Ui, SetupWebGlContext, LoadShaders, LoadScene, SendMessage, FindNodes, RenderScene, Msg, GlMatrix) {
    "use strict";

    var _scene,
      _cube;

    function _onSetupComplete(error, results) {
      if (error) {
        _handleError(error);
      } else {
        _scene = results.loadedScene;

        FindNodes.byId(_scene, "cube", function(error, node) {
          if (error) {
            _handleError(error);
          } else {
            _cube = node;
          }
        });

        $(document).keydown(function(event) {
          if (event.which === 87) {  // w
            SendMessage.execute(new Msg.ManipulationRequest("cube", "ApplyImpulse", [0, 5, 0]), _onServerResponse);
          } else if (event.which === 83) {  // s
            SendMessage.execute(new Msg.ManipulationRequest("cube", "ApplyImpulse", [0, -5, 0]), _onServerResponse);
          } else if (event.which === 68) { // d
            SendMessage.execute(new Msg.ManipulationRequest("cube", "ApplyImpulse", [5, 0, 0]), _onServerResponse);
          } else if (event.which === 65) { // a
            SendMessage.execute(new Msg.ManipulationRequest("cube", "ApplyImpulse", [-5, 0, 0]), _onServerResponse);
          } else if (event.which === 74) { // j
            SendMessage.execute(new Msg.ManipulationRequest("cube", "ApplyImpulse", [0, 0, 5]), _onServerResponse);
          } else if (event.which === 73) { // i
            SendMessage.execute(new Msg.ManipulationRequest("cube", "ApplyImpulse", [0, 0, -5]), _onServerResponse);
          }
        });

        Ui.updateStatus("info", "Rendering...");
        RenderScene.execute(results.loadedScene, results.glContext, results.loadedShaderProgram, _handleError);
      }
    }

    function _handleError(error) {
      Ui.updateStatus("error", "An error occured: '" + error.message + "' See console log for details.");
      Utils.log("ERROR", error.stack);
    }

    function _onServerResponse(error, response) {
      var transformedResponse = GlMatrix.mat4.create();

      if (error) {
        _handleError(error);
      } else if (response.status === "transform") {
        GlMatrix.mat4.transpose(response.data.transformation, transformedResponse);
        _cube.transformation = transformedResponse;
      }
    }

    return {
      execute: function() {
        Ui.init(function() {
          Ui.updateStatus("info", "Reloading...");
          Utils.log("Reset!", Ui.getCurrentShader(), Ui.getCurrentScene());

          this.execute();
        }.bind(this));

        Async.auto({
            glContext: function(callback) {
              Ui.updateStatus("info", "Setting up WebGL context...");
              SetupWebGlContext.execute(Ui.getRenderCanvas(), callback);
            },
            loadedScene: ["glContext", function(callback, results) {
              Ui.updateStatus("info", "Loading selected Scene...");
              LoadScene.execute(Ui.getCurrentScene(), results.glContext, callback);
            }],
            loadedShaderProgram: ["glContext", function(callback, results) {
              Ui.updateStatus("info", "Loading selected shader program...");
              LoadShaders.execute(Ui.getCurrentShader(), results.glContext, callback);
            }]
          },
          _onSetupComplete);
      }
    };
  }

)
;
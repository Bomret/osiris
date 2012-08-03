/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["Utils", "jquery", "WebGl", "async", "MainViewModel", "SetupWebGlContext", "LoadShaders", "LoadScene", "LoadModelFromColladaFile", "SendMessage", "FindNodes", "RenderScene", "Messaging", "GlMatrix"],
  function(Utils, $, WebGl, Async, Ui, SetupWebGlContext, LoadShaders, LoadScene, LoadModelFromColladaFile, SendMessage, FindNodes, RenderScene, Msg, GlMatrix) {
    "use strict";

    var _scene,
      _cube = {};

    function _onSetupComplete(error, results) {
      if (error) {
        _handleError(error);
      } else {
        Utils.log("RESULTS", results);
        _scene = results.loadedScene;

//        $(document).keydown(function(event) {
//          GlMatrix.mat4.translate(_cube.transformation, [1, 2, 3], _cube.transformation);
//          GlMatrix.mat4.transpose(_cube.transformation, _cube.transformation);
//          Utils.log("TRANSFORM", _cube.transformation);
//        });

        SendMessage.execute(new Msg.RenderStartRequest(), function(error, response) {
          if (error) {
            _handleError(error);
          } else if (response.status === "transform") {
            //Utils.log("TRANSFORM", response);
            GlMatrix.mat4.transpose(response.data.transformation, response.data.transformation);
            _cube.transformation = response.data.transformation;
            //GlMatrix.mat4.rotateY(_cube.transformation, Utils.degreesToRadians(5), _cube.transformation);
          }
        });

        FindNodes.byId(_scene, "cube", function(error, node) {
          if (error) _handleError(error);
          _cube = node;
        });

        Ui.updateStatus("info", "Rendering...");
        RenderScene.execute(results.loadedScene, results.glContext, results.loadedShaderProgram, _handleError);
      }
    }

    function _handleError(error) {
      Ui.updateStatus("error", "An error occured: '" + error.message + "' See console log for details.");
      Utils.log("ERROR", error.stack);
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
);
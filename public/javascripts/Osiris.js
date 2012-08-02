/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["Utils", "jquery", "WebGl", "async", "MainViewModel", "SetupWebGlContext", "LoadShaders", "LoadScene", "LoadModelFromColladaFile", "SendMessage", "RenderScene", "Messaging"],
  function(Utils, $, WebGl, Async, Ui, SetupWebGlContext, LoadShaders, LoadScene, LoadModelFromColladaFile, SendMessage, RenderScene, Msg) {
    "use strict";

    var _scene;

    function _onSetupComplete(error, results) {
      if (error) {
        _handleError(error);
      } else {
        Utils.log("RESULTS", results);
        _scene = results.loadedScene;

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

        $(document).keydown(function(event) {
          SendMessage.execute(new Msg.ManipulationRequest("cube", "ApplyImpulse", [0, 1, 0]), function(error, response) {
            if (error) {
              _handleError(error);
            }
            Utils.log("TRANSFORM", response);
          });
        });

//        LoadModelFromColladaFile.execute(null, function(data) {
//          var collada = $.parseXML(data);
//
//          var geometry = collada.getElementsByTagName("geometry")[0];
//          Utils.log("GEOMETRY", geometry);
//
//          var tech_common = geometry.getElementsByTagName("technique_common")[0];
//          var accessor = tech_common.getElementsByTagName("accessor")[0];
//
//          Utils.log("ACCESSOR", accessor);
//        });

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
            }],
            renderStartResponse:["loadedScene", "loadedShaderProgram", function(callback) {
              Ui.updateStatus("info", "Notifying server to start rendering...");
              SendMessage.execute(new Msg.RenderStartRequest(), callback);
            }]
          },
          _onSetupComplete);
      }
    };
  }
);
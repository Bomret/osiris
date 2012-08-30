/**
 * User: Stefan Reichel
 * Date: 02.07.12
 * Time: 01:47
 */

define(["Log", "zepto", "Scene", "Shader"], function(Log, $, Scene, Shader) {
    "use strict";

    var _loadCallback,
      _renderCanvas,
      _statusOutput;

    function _setupRenderButton() {
      $("#startRender").on("click", function() {
        $("#settings").hide();
        $("#renderCanvas").show();
        _loadCallback();
      });
    }

    function _setupRenderCanvas() {
      var canvas = $("#renderCanvas");
      canvas.hide();
      _renderCanvas = canvas.get(0);
    }

    function _setupStatusOutput() {
      _statusOutput = $("#statusOutput");
      _statusOutput.css("width", window.innerWidth);
      _statusOutput.html("<p>Please select the desired scene and shader below.</p>");
    }

    return {
      init: function(resetCallback) {
        _loadCallback = resetCallback;
        _setupRenderCanvas();
        _setupStatusOutput();
        _setupRenderButton();
      },

      getCurrentScene: function() {
        var selectedOptions = $("#availableScenes option").not(function() {return !this.selected;});

        return new Scene.SceneInformation(selectedOptions[0].text, selectedOptions[0].value);
      },

      getCurrentShader: function() {
        var selectedOptions = $("#availableShaders option").not(function() {return !this.selected;});

        return new Shader.ShaderConfigurationInformation(selectedOptions[0].text, JSON.parse(selectedOptions[0].value));
      },

      getRenderCanvas: function() {
        return _renderCanvas;
      },

      updateStatus: function(type, message) {
        if (type === "info") {
          _statusOutput.html("<p><strong>Info:</strong> " + message + "</p>")
            .css("background-color", "#D2E0E6")
            .css("color", "#568CE0");
        } else if (type === "error") {
          _statusOutput.html("<p><strong>Error:</strong> " + message + "</p>")
            .css("background-color", "#FFDDDD")
            .css("color", "#FF2222");
          $("#renderCanvas").hide();
        }
      }
    };
  }
);
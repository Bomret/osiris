/**
 * User: Stefan Reichel
 * Date: 02.07.12
 * Time: 01:47
 */

define(["Log", "jquery", "Scene", "Shader"], function(Log, $, Scene, Shader) {
    "use strict";

    var _loadCallback,
      _availableScenes = [],
      _availableShaders = [],
      _currentScene,
      _currentShader,
      _renderCanvas,
      _statusOutput;

    function _setupAvailableShaders() {
      $("#availableShaders option").each(function(index, element) {
        var name = element.text,
          config = JSON.parse(element.value);

        _availableShaders.push(new Shader.ShaderConfigurationInformation(name, config));
      });

      _currentShader = _availableShaders[$("#availableShaders option:selected").index()];
    }

    function _setupAvailableScenes() {
      $("#availableScenes option").each(function(index, element) {
        _availableScenes.push(new Scene.SceneInformation(element.text, element.value));
      });

      _currentScene = _availableScenes[$("#availableScenes option:selected").index()];
    }

    function _setupRenderButton() {
      $("#startRender").click(function() {
        $("#settings").hide();
        $("#renderCanvas").show();
        _loadCallback();
      });
    }

    function _setupRenderCanvas() {
      _renderCanvas = $("#renderCanvas").hide().get(0);
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
        _setupAvailableShaders();
        _setupAvailableScenes();
        _setupRenderButton();
      },

      getCurrentScene: function() {
        return _currentScene;
      },

      getCurrentShader: function() {
        return _currentShader;
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
        }
      }
    };
  }
);
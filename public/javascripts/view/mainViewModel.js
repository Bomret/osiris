/**
 * User: Stefan Reichel
 * Date: 02.07.12
 * Time: 01:47
 */

define(["Utils", "jquery", "Scene", "Shader"], function(Utils, $, Scene, Shader) {
    "use strict";

    var _resetCallback,
      _availableScenes,
      _availableShaders,
      _currentScene,
      _currentShader,
      _renderCanvas,
      _statusOutput;

    function _setupAvailableShaders() {
      _availableShaders = [];

      $("#availableShaders option").each(function(index, element) {
        var name = element.text,
          config = JSON.parse(element.value);

        _availableShaders.push(new Shader.ShaderConfigurationInformation(name, config));
      });
      _currentShader = _availableShaders[$("#availableShaders option:selected").index()];

      Utils.log("Available shaders", _availableShaders);
      Utils.log("Current Shader", _currentShader);

      $("#availableShaders").change(function() {
        _currentShader = _availableShaders[this.selectedIndex];
        Utils.log("Current Shader changed", _currentShader);
      });
    }

    function _setupAvailableScenes() {
      _availableScenes = [];

      $("#availableScenes option").each(function(index, element) {
        _availableScenes.push(new Scene.SceneInformation(element.text, element.value));
      });

      _currentScene = _availableScenes[$("#availableScenes option:selected").index()];

      Utils.log("Available scenes", _availableScenes);
      Utils.log("Current Scene", _currentScene);

      $("#availableScenes").change(function() {
        _currentShader = _availableScenes[this.selectedIndex];
        Utils.log("Current Scene changed", _currentScene);
      });
    }

    function _setupRenderButton() {
      $("#startRender").click(function() {
        _resetCallback();
      });
    }

    function _setupRenderCanvas() {
      Utils.log("Setting up canvas");
      _renderCanvas = $("#renderCanvas").get(0);
    }

    function _setupStatusOutput() {
      _statusOutput = $("#statusOutput");
    }

    return {
      init: function(resetCallback) {
        _resetCallback = resetCallback;
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
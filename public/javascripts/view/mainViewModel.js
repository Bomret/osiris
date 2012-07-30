/**
 * User: Stefan Reichel
 * Date: 02.07.12
 * Time: 01:47
 */

define(["utils", "jquery", "scene", "shader"], function(utils, $, scene, shader) {
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

        _availableShaders.push(new shader.ShaderConfigurationInformation(name, config));
      });
      _currentShader = _availableShaders[$("#availableShaders option:selected").index()];

      utils.log("Available shaders", _availableShaders);
      utils.log("Current shader", _currentShader);

      $("#availableShaders").change(function() {
        _currentShader = _availableShaders[this.selectedIndex];
        utils.log("Current shader changed", _currentShader);
      });
    }

    function _setupAvailableScenes() {
      _availableScenes = [];

      $("#availableScenes option").each(function(index, element) {
        _availableScenes.push(new scene.SceneInformation(element.text, element.value));
      });

      _currentScene = _availableScenes[$("#availableScenes option:selected").index()];

      utils.log("Available scenes", _availableScenes);
      utils.log("Current scene", _currentScene);

      $("#availableScenes").change(function() {
        _currentShader = _availableScenes[this.selectedIndex];
        utils.log("Current scene changed", _currentScene);
      });
    }

    function _setupRenderButton() {
      $("#startRender").click(function() {
        _resetCallback();
      });
    }

    function _setupRenderCanvas() {
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
            .css("background-color", "#DDDDFF")
            .css("color", "#2222FF");
        } else if (type === "error") {
          _statusOutput.html("<p><strong>Error:</strong> " + message + "</p>")
            .css("background-color", "#FFDDDD")
            .css("color", "#FF2222");
        }
      }
    };
  }
);
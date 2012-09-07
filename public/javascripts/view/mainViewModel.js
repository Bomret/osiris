/**
 * Provides an abstraction layer for the HTML page.
 *
 * User: Stefan Reichel
 * Date: 02.07.12
 * Time: 01:47
 */
define(["zepto", "Scene", "Shader"], function($, Scene, Shader) {
    "use strict";

    var _loadCallback,
      _renderCanvas,
      _statusOutput;

    /**
     * Registers the load callback with the start button.
     *
     * @private
     */
    function _setupRenderButton() {
      $("#startRender").on("click", function() {
        $("#settings").hide();
        $("#renderCanvas").show();
        _loadCallback();
      });
    }

    /**
     * Sets up the private _renderCanvas variable.
     *
     * @private
     */
    function _setupRenderCanvas() {
      var canvas = $("#renderCanvas");
      canvas.hide();
      _renderCanvas = canvas.get(0);
    }

    /**
     * Sets up the status output with the initial message
     *
     * @private
     */
    function _setupStatusOutput() {
      _statusOutput = $("#statusOutput");
      _statusOutput.html("<p>Please select the desired scene and shader below.</p>");
    }

    return {

      /**
       * Initializes the view model and runs the setup for all components.
       *
       * @param resetCallback
       */
      init: function(resetCallback) {
        _loadCallback = resetCallback;
        _setupRenderCanvas();
        _setupStatusOutput();
        _setupRenderButton();
      },

      /**
       * Returns information about the currently selected scene.
       *
       * @return {SceneInformation}
       */
      getCurrentScene: function() {
        var selectedOptions = $("#availableScenes option").not(function() {return !this.selected;});

        return new Scene.SceneInformation(selectedOptions[0].text, selectedOptions[0].value);
      },

      /**
       * Returns information about the currently selected shader program.
       *
       * @return {ShaderConfigurationInformation}
       */
      getCurrentShader: function() {
        var selectedOptions = $("#availableShaders option").not(function() {return !this.selected;});

        return new Shader.ShaderConfigurationInformation(selectedOptions[0].text, JSON.parse(selectedOptions[0].value));
      },

      /**
       * Returns the render canvas.
       *
       * @return {HTMLCanvasElement}
       */
      getRenderCanvas: function() {
        return _renderCanvas;
      },

      /**
       * Updates the status output to the given type and message. The currently available types are "info" and "error". Info messages are rendered in blue, error messages in red.
       *
       * @param {String} type The type of the message.
       * @param {String} message The message to be displayed.
       */
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
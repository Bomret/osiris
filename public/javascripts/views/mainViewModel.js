/**
 * User: Stefan Reichel
 * Date: 02.07.12
 * Time: 01:47
 */

define(["utils", "jquery", "amplify", "scene", "shader"], function (utils, $, amplify, scene, shader) {
        "use strict";

        var _availableScenes,
            _availableShaders,
            _currentScene,
            _currentShader,
            _renderCanvas;

        function _setupAvailableShaders() {
            _availableShaders = [];

            $("#availableShaders option").each(function (index, element) {
                var name = element.text,
                    config = JSON.parse(element.value);

                _availableShaders.push(new shader.ShaderConfigurationInformation(name, config));
            });
            _currentShader = _availableShaders[0];

            utils.log("Available shaders", _availableShaders);
            utils.log("Current shader", _currentShader);

            $("#availableShaders").change(function () {
                _currentShader = _availableShaders[this.selectedIndex];
                utils.log("Current shader changed", _currentShader);
            });
        }

        function _setupAvailableScenes() {
            _availableScenes = [];

            $("#availableScenes option").each(function (index, element) {
                _availableScenes.push(new scene.SceneInformation(element.text, element.value));
            });

            _currentScene = _availableScenes[0];

            utils.log("Available scenes", _availableScenes);
            utils.log("Current scene", _currentScene);

            $("#availableScenes").change(function () {
                _currentShader = _availableScenes[this.selectedIndex];
                utils.log("Current scene changed", _currentScene);
            });
        }

        function _setupRenderButton() {
            $("#startRender").click(function (event) {
                amplify.publish("osiris-ui-change", event);
            });
        }

        function _setupRenderCanvas() {
            _renderCanvas = $("#renderCanvas").get(0);
        }

        return {
            /**
             *
             */
            init:function () {
                _setupRenderCanvas();
                _setupAvailableShaders();
                _setupAvailableScenes();
                _setupRenderButton();
            },

            /**
             *
             * @return
             */
            getCurrentScene:function () {
                return _currentScene;
            },

            /**
             *
             * @return
             */
            getCurrentShader:function () {
                return _currentShader;
            },

            /**
             *
             * @return {*}
             */
            getRenderCanvas:function () {
                return _renderCanvas;
            }
        };
    }
);
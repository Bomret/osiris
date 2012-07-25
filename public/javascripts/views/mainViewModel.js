/**
 * User: Stefan Reichel
 * Date: 02.07.12
 * Time: 01:47
 */

define(["utils", "scene", "shader"], function (utils, scene, shader) {
    "use strict";

    var _availableScenes = [],
        _availableShaders = [],
        _currentScene,
        _currentShader,
        _resetCallback;

    function _setupAvailableShaders() {
        var i,
            cmbAvailableShaders = document.getElementById("availableShaders"),
            options = cmbAvailableShaders.options,
            len = options.length;

        for (i = 0; i < len; i++) {
            _availableShaders.push(new shader.ShaderInformation(options[i].text, options[i].value));
        }
        _currentShader = new shader.ShaderInformation(options[0].text, options[0].value);

        utils.log("Available shaders", _availableShaders);
        utils.log("Current shader", _currentShader);

        cmbAvailableShaders.onchange = function () {
            _currentShader = _availableShaders[this.selectedIndex];
            utils.log("Current shader changed", _currentShader);
        };
    }

    function _setupAvailableScenes() {
        var i,
            cmbAvailableScenes = document.getElementById("availableScenes"),
            options = cmbAvailableScenes.options,
            len = options.length;

        for (i = 0; i < len; i++) {
            _availableScenes.push(new scene.SceneInformation(options[i].text, options[i].value));
        }
        _currentScene = new scene.SceneInformation(options[0].text, options[0].value);

        utils.log("Available scenes", _availableScenes);
        utils.log("Current scene", _currentScene);

        cmbAvailableScenes.onchange = function () {
            _currentShader = _availableScenes[this.selectedIndex];
            utils.log("Current scene changed", _currentScene);
        };
    }

    function _setupRenderButton() {
        var btnStartRender = document.getElementById("startRender");
        btnStartRender.onclick = _resetCallback;
    }

    return {
        /**
         *
         * @param {Function} resetCallback
         */
        init:function (resetCallback) {
            _resetCallback = resetCallback;
            _setupAvailableShaders();
            _setupAvailableScenes();
            _setupRenderButton();
        },

        /**
         *
         * @return {SceneInformation}
         */
        getCurrentScene:function () {
            return _currentScene;
        },

        /**
         *
         * @return {ShaderInformation}
         */
        getCurrentShader:function () {
            return _currentShader;
        }
    };
});
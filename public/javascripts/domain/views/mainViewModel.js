/**
 * User: Stefan Reichel
 * Date: 02.07.12
 * Time: 01:47
 */

define(["utils", "loadFile"], function (utils, loadFile) {
    "use strict";

    var _availableScenes,
        _availableShaderPrograms;

    function _onAvailableScenesChange(event) {

    }

    return {
        init:function () {
            var cmbAvailableShaders = document.getElementById("availableScenes");
            cmbAvailableShaders.addEventListener("change", _onAvailableScenesChange, false);

        },
        presentAvailableShaders:function () {

        }
    };
});
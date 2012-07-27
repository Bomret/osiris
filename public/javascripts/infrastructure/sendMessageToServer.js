/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 01:58
 */

define(["utils", "amplify"], function (utils, amplify) {
    "use strict";

    var _socket = new WebSocket("ws://localhost:9000/socket");

    _socket.onopen = function () {
        amplify.publish("osiris-socket-ready");
    };

    _socket.onclose = function () {
        amplify.publish("osiris-socket-close");
    };

    _socket.onmessage = function (message) {
        amplify.publish("osiris-socket-message", message);
    };

    _socket.onerror = function (error) {
        amplify.publish("osiris-error", error);
    };

    return {
        execute:function (message) {
            if (_socket.readyState === 1) {
                _socket.send(JSON.stringify(message));
            }
        }
    };
});
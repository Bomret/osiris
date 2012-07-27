/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 01:58
 */

define(["utils"], function (utils) {
    "use strict";

    var _socket = new WebSocket("ws://localhost:9000/socket");

    return {
        execute:function (message, onMessage, onError) {
            _socket.onmessage = function (event) {
                onMessage(event);
            };

            _socket.onerror = function (event) {
                onError(event);
            };

            if (_socket.readyState === 1) {
                _socket.send(JSON.stringify(message));
            }
        }
    };
});
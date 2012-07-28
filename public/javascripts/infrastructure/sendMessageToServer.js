/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 01:58
 */

define(function () {
    "use strict";

    var _socket = new WebSocket("ws://localhost:9000/socket");

    return {
        execute:function (message, callbacks) {
            _socket.onmessage = function (message) {
                callbacks.onSuccess(message);
            };

            _socket.onerror = function (error) {
                callbacks.onError(error);
            };

            if (_socket.readyState === 1) {
                _socket.send(JSON.stringify(message));
            }
        }
    };
});
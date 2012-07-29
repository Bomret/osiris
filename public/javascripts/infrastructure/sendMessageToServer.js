/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 01:58
 */

define(function () {
    "use strict";

    var _socket = new WebSocket("ws://localhost:9000/socket");

    return {
        execute:function (message, callback) {
            _socket.onmessage = function (message) {
                callback(null, message);
            };

            _socket.onerror = function (error) {
                callback(error);
            };

            if (_socket.readyState === 1) {
                _socket.send(JSON.stringify(message));
            }
        }
    };
});
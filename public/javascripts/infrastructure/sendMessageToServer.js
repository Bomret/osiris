/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 01:58
 */

define(["utils"], function (utils) {
    "use strict";

    var _socket = new WebSocket("ws://localhost:9000/socket");

    function _send(message) {
        utils.log("Socket sends", message);
        _socket.send(JSON.stringify(message));
    }

    return {
        execute:function (message, callback) {
            _socket.onmessage = function (event) {
                utils.log("Server message", event);
                var msg = JSON.parse(event.data);
                if (msg.status === "error") {
                    callback({
                        message:msg.data.message,
                        stack:msg.data.stack
                    });
                }
                callback(null, msg);
            };

            _socket.onerror = function (error) {
                utils.log("Server error", error);
                callback(error);
            };

            if (_socket.readyState === 1) {
                _send(message);
            } else {
                utils.log("Socket not ready, yet. Waiting...");
                _socket.onopen = function () {
                    _send(message);
                };
            }
        }
    };
});
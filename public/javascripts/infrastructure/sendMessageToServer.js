/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 01:58
 */

define(["Utils"], function(Utils) {
  "use strict";

  var _socket = new WebSocket("ws://localhost:9000/socket");

  function _send(message) {
    Utils.log("Socket sends", message);
    _socket.send(JSON.stringify(message));
  }

  return {
    execute: function(message, callback) {
      _socket.onmessage = function(event) {
        Utils.log("Server message", event);
        var msg = JSON.parse(event.data);
        if (msg.status === "error") {
          callback({
            message: "OSIRIS: " + msg.data.message,
            stack: msg.data.stack
          });
        }
        callback(null, msg);
      };

      _socket.onerror = function(error) {
        Utils.log("Server error", error);
        callback(error);
      };

      if (_socket.readyState === 1) {
        _send(message);
      } else {
        Utils.log("Socket not ready, yet. Waiting...");
        _socket.onopen = function() {
          _send(message);
        };
      }
    }
  };
});
/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 01:58
 */

define(function() {
  "use strict";

  var _socket = new WebSocket("ws://" + window.location.hostname + ":" + window.location.port + "/socket");

  function _send(message) {
    _socket.send(JSON.stringify(message));
  }

  return {
    execute: function(message, callback) {
      _socket.onmessage = function(event) {
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
        callback(error);
      };

      if (_socket.readyState === 1) {
        _send(message);
      } else {
        // Socket not ready, yet. As soon as it is opened, the message will be send.
        _socket.onopen = function() {
          _send(message);
        };
      }
    }
  };
});
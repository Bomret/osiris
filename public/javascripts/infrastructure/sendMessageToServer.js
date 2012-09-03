/**
 * Sends a message to the Osiris server.
 *
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 01:58
 */
define(function() {
  "use strict";

  var _socket = new WebSocket("ws://" + window.location.hostname + ":" + window.location.port + "/socket");

  /**
   * Sends the given message to the Osiris server.
   *
   * @param {Object} message The message to be send.
   * @private
   */
  function _send(message) {
    _socket.send(JSON.stringify(message));
  }

  return {

    /**
     * Sends the given message to the Osiris server. It must be possible to turn the message into a valid JSON string for sending. The given callback is called in case an error happens or each time a message is received from the server. In the latter case the server message is handed to the callback.
     *
     * @param {Object} message The message to be send.
     * @param {Function} callback A registered callback that signals the result of the operation (error or success).
     */
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
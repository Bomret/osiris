/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 19:01
 */

define(function() {
  "use strict";

  function OsirisMessage(request) {
    this.request = request;
  }

  return {
    SetupRequest: function(data) {
      OsirisMessage.call(this, "setup");
      this.data = data;
    },

    ShutDownRequest: function() {
      OsirisMessage.call(this, "shutdown");
    },

    RenderStartRequest: function() {
      OsirisMessage.call(this, "start");
    },

    ManipulationRequest: function(nodeId, manipulationType, manipulationData) {
      OsirisMessage.call(this, "manipulate");
      this.data = {
        nodeId: nodeId,
        type: manipulationType,
        manipulationData: manipulationData
      };
    }
  };
});
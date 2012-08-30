/**
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 19:01
 */

define(function() {
  "use strict";

  return {
    SetupRequest: function(nodes) {
      this.request = "setup";
      this.data = nodes;
    },

    ManipulationRequest: function(nodeId, manipulationType, manipulationData) {
      this.request = "manipulate";
      this.data = {
        nodeId: nodeId,
        type: manipulationType,
        manipulationData: manipulationData
      };
    }
  };
});
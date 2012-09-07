/**
 * Contains data objects relevant for the communication with the server.
 *
 * User: Stefan Reichel
 * Date: 27.07.12
 * Time: 19:01
 */
define(function() {
  "use strict";

  return {

    /**
     * Used to tell SIRIS it should create and register entities for the given scene nodes.
     *
     * @param {Object} nodes The nodes SIRIS should setup.
     * @constructor
     */
    SetupRequest: function(nodes) {
      this.request = "setup";
      this.data = nodes;
    },

    /**
     * Used to manipulate the model node with the given id in the scene with the given manipulation information.
     *
     * @param {String} id The id of the model node.
     * @param manipulationType The type of the manipulation to apply.
     * @param manipulationData The relevant data for the manipulation type.
     * @constructor
     */
    ManipulationRequest: function(id, manipulationType, manipulationData) {
      this.request = "manipulate";
      this.data = {
        nodeId: id,
        type: manipulationType,
        manipulationData: manipulationData
      };
    }
  };
});
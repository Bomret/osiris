package osiris.domain

import siris.components.physics.ApplyImpulse
import siris.core.svaractor.SVarActorLW
import osiris.contracts.ManipulationRequest
import siris.core.worldinterface.WorldInterfaceHandling
import actors.Actor

/**
 * User: Stefan Reichel
 * Date: 01.08.12
 * Time: 14:15
 */

class EntityManipulator(physics: Actor) extends SVarActorLW with WorldInterfaceHandling {

  addHandler[ManipulationRequest] {
    request => {
      handleEntity(request.nodeSymbol)(node => {
        if (request.manipulationType == "ApplyImpulse") {
          val data = request.manipulationData
          physics ! ApplyImpulse(node.get, data)
        }
      })
    }
  }
}

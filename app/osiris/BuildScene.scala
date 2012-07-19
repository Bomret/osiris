package osiris

import siris.components.io.IORegistryHandling
import siris.components.physics.jbullet.JBulletComponent
import siris.components.physics.PhysicsConfiguration
import siris.core.entity.EntityCreationHandling
import siris.core.svaractor.SVarActorHW

/**
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 15:09
 */

object BuildScene extends SVarActorHW with EntityCreationHandling with IORegistryHandling {
  createActor[JBulletComponent]()(physics => {
    println("Components created")
  })(error => {
    println(error.getMessage)
  })

  start()
}

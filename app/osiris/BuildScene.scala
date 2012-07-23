package osiris

import siris.components.io.IORegistryHandling
import siris.components.physics.jbullet.JBulletComponent
import siris.components.physics.PhysicsConfiguration
import siris.core.entity.EntityCreationHandling
import siris.core.svaractor.SVarActorHW
import simplex3d.math.floatm.ConstVec3f

/**
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 15:09
 */

object BuildScene extends SVarActorHW with EntityCreationHandling with IORegistryHandling {
  createActor[JBulletComponent]()(physics => {

    physics ! PhysicsConfiguration(ConstVec3f(0.0f, -9.81f, 0.0f))
    println("Components created for Osiris")

  })(error => {
    println(error.getMessage)
  })

  start()
}

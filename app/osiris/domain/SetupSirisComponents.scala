package osiris.domain

import siris.components.io.IORegistryHandling
import siris.components.physics.jbullet.JBulletComponent
import siris.components.physics.{PhysBox, PhysicsConfiguration}
import siris.core.entity.{Entity, EntityCreationHandling}
import siris.core.ontology.EntityDescription
import siris.core.ontology.types.Transformation
import siris.core.svaractor.SVarActorHW
import simplex3d.math.floatm.renamed.{ConstMat4, Mat4x4}
import simplex3d.math.floatm.ConstVec3f
import osiris.contracts.{SetupComplete, TransformRequest, SetupRequest, OsirisError}
import play.api.libs.json.{Json, JsObject}

/**
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 15:09
 */

class SetupSirisComponents extends SVarActorHW with EntityCreationHandling with IORegistryHandling {
  createActor[JBulletComponent]()(physics => {
    physics ! PhysicsConfiguration(ConstVec3f(0.0f, -9.81f, 0.0f))
  })(error => sender ! OsirisError(error))

  override def shutdown() {
    super.shutdown()
  }

  addHandler[SetupRequest] {
    msg =>
      msg.nodes map {
        node => {
          try {
            val transformation = (node \ "transformation").as[Array[Float]]
            val physics = (node \ "physics").as[JsObject]
            val shape = (physics \ "shape").as[String]
            val halfExtends = (physics \ "halfExtends").as[Float]
            val restitution = (physics \ "restitution").as[Float]
            val mass = (physics \ "mass").as[Float]

            val trans: ConstMat4 = ConstMat4(
              transformation(0), transformation(1), transformation(2), transformation(3),
              transformation(4), transformation(5), transformation(6), transformation(7),
              transformation(8), transformation(9), transformation(10), transformation(11),
              transformation(12), transformation(13), transformation(14), transformation(15)
            )

            realize(
              EntityDescription(
                PhysBox(
                  transform = Left(trans),
                  halfExtends = ConstVec3f(halfExtends),
                  restitution = restitution,
                  mass = mass
                )
              ),
              ((e: Entity) => {
                e.get(Transformation) match {
                  case Some(sVar) => observe(sVar, (mat: Mat4x4) => {
                    sender ! TransformRequest(Json.toJson(mat.toString()))
                  })
                }
              })
            )

            sender ! SetupComplete()
          } catch {
            case ex: Exception => sender ! OsirisError(ex)
          }
        }
      }
  }
}

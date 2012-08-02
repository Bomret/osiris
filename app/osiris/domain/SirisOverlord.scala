package osiris.domain

import siris.components.io.IORegistryHandling
import siris.components.physics.jbullet.JBulletComponent
import siris.components.physics.{ApplyImpulse, PhysPlane, PhysBox, PhysicsConfiguration}
import siris.core.entity.description.AspectBase
import siris.core.entity.{Entity, EntityCreationHandling}
import siris.core.ontology.EntityDescription
import siris.core.ontology.types.Transformation
import siris.core.svaractor.SVarActorHW
import simplex3d.math.floatm.renamed.{ConstMat4, Mat4x4}
import simplex3d.math.floatm.ConstVec3f
import osiris.contracts._
import scala.Left
import play.api.libs.json.{JsValue, JsObject}
import scala.Some
import actors.{OutputChannel, AbstractActor}

/**
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 15:09
 */

class SirisOverlord extends SVarActorHW with EntityCreationHandling with IORegistryHandling {
  var physicsActor: AbstractActor = null

  override def startUp() {
    createComponents()
  }

  protected def createComponents() {
    createActor[JBulletComponent]()(physics => {
      physics ! PhysicsConfiguration(ConstVec3f(0.0f, -9.81f, 0.0f))

      physicsActor = physics
    })(error => sender ! OsirisError(error))
  }

  override def shutdown() {
    super.shutdown()
  }

  private def _makePhysicShape(node: JsValue): AspectBase = {
    val transformation = (node \ "transformation").as[Array[Float]]
    val physics = (node \ "physics").as[JsObject]
    val shape = (physics \ "shape").as[String]

    var physShape: AspectBase = null

    if (shape == "box") {
      val halfExtends = (physics \ "halfExtends").as[Float]
      val restitution = (physics \ "restitution").as[Float]
      val mass = (physics \ "mass").as[Float]

      physShape = PhysBox(
        transform = Left(ConstMat4(
          transformation(0), transformation(1), transformation(2), transformation(3),
          transformation(4), transformation(5), transformation(6), transformation(7),
          transformation(8), transformation(9), transformation(10), transformation(11),
          transformation(12), transformation(13), transformation(14), transformation(15)
        )),
        halfExtends = ConstVec3f(halfExtends),
        restitution = restitution,
        mass = mass
      )
    } else if (shape == "plane") {
      val normal = (physics \ "normal").as[Array[Float]]
      val mass = (physics \ "mass").as[Float]
      physShape = PhysPlane(
        transform = Left(ConstMat4(
          transformation(0), transformation(1), transformation(2), transformation(3),
          transformation(4), transformation(5), transformation(6), transformation(7),
          transformation(8), transformation(9), transformation(10), transformation(11),
          transformation(12), transformation(13), transformation(14), transformation(15)
        )),
        normal = ConstVec3f(normal(0), normal(1), normal(2)),
        mass = mass
      )
    }

    sender ! OsirisDebug("Made PhysShape: " + physShape)
    physShape
  }

  addHandler[SetupRequest] {
    msg => {
      val origin = sender

      msg.nodes foreach {
        node => {
          try {
            val id = (node \ "id").as[String]

            sender ! OsirisDebug("Will setup node id: " + id)

            realize(
              EntityDescription(
                _makePhysicShape(node)
              ),
              (e: Entity) => {
                registerEntity(Symbol(id), e)
                e.get(Transformation) match {
                  case Some(sVar) => observe(sVar, (mat: Mat4x4) => {
                    origin ! TransformRequest(id,mat)
                  })
                  case None => origin ! OsirisError(new Exception("FUUU!"))
                }
              }
            )

            origin ! OsirisDebug("After realize")
          } catch {
            case ex: Exception => origin ! OsirisError(ex)
          }
        }
      }

      origin ! NodesSetupComplete()
    }
  }

  addHandler[ManipulationRequest] {
    request => {
      val origin = sender

      try {
        origin ! OsirisDebug("Got ManipulationRequest: id(" + request.nodeSymbol + "), type(" + request.manipulationType + ")")

        handleEntity(request.nodeSymbol)(node => {
          if (request.manipulationType == "ApplyImpulse") {
            val data = request.manipulationData
            physicsActor ! ApplyImpulse(node.get, data)
          }
        })
      } catch {
        case ex: Exception => origin ! OsirisError(ex)
      }
    }
  }
}

package osiris.domain

import siris.components.io.IORegistryHandling
import siris.components.physics.jbullet.JBulletComponent
import siris.components.physics.{PhysPlane, PhysBox, PhysicsConfiguration}
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

/**
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 15:09
 */

class SirisOverlord extends SVarActorHW with EntityCreationHandling with IORegistryHandling {

  override def startUp() {
    createComponents()
  }

  protected def createComponents() {
    createActor[JBulletComponent]()(physics => {
      physics ! PhysicsConfiguration(ConstVec3f(0.0f, -9.81f, 0.0f))

      createActor[EntityManipulator](physics)(manipulationActor => {
        registerActor('manipulator, manipulationActor)
      })(error => sender ! OsirisError(error))
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

    physShape
  }

  addHandler[SetupRequest] {
    msg =>
      msg.nodes map {
        node => {
          try {
            val id = (node \ "id").as[String]
            realize(
              EntityDescription(
                _makePhysicShape(node)
              ),
              ((e: Entity) => {
                registerEntity(Symbol(id), e)
                e.get(Transformation) match {
                  case Some(sVar) => observe(sVar, (mat: Mat4x4) => {
                    sender ! TransformRequest(mat)
                  })
                }
              })
            )
          } catch {
            case ex: Exception => sender ! OsirisError(ex)
          }
        }
      }

      sender ! NodesSetupComplete()
  }

  addHandler[ManipulationRequest] {
    request =>
      handleActor('manipulator)(
        actor => actor.get ! request
      )
  }
}
